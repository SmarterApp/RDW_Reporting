import { Component, Inject } from '@angular/core';
import { AggregateReportColumnOrderItemProvider } from '../aggregate-report-column-order-item.provider';
import { AssessmentDefinitionService } from '../assessment/assessment-definition.service';
import { AggregateReportOrganizationService } from '../aggregate-report-organization.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AggregateReportTableDataService } from '../aggregate-report-table-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AggregateReportRequestMapper } from '../aggregate-report-request.mapper';
import { AggregateReportService } from '../aggregate-report.service';
import { AggregateReportOptionsMapper } from '../aggregate-report-options.mapper';
import { NotificationService } from '../../shared/notification/notification.service';
import { AssessmentDefinition } from '../assessment/assessment-definition';
import { ScrollNavItem } from '../../shared/nav/scroll-nav.component';
import { SubgroupFilterSupport } from '../subgroup/subgroup-filters';
import { SubgroupMapper } from '../subgroup/subgroup.mapper';
import { MultiOrganizationQueryFormComponent } from './multi-organization-query-form.component';
import { fileName, notEmpty } from '../../shared/form/validators';
import { Utils } from '../../shared/support/support';
import { AggregateReportFormOptions } from '../aggregate-report-form-options';
import { Claim } from '../aggregate-report-options.service';
import { AggregateReportType } from '../aggregate-report-form-settings';
import { ScorableClaimOrderingProvider } from '../../shared/ordering/orderings';

@Component({
  selector: 'claim-report-form',
  templateUrl: './claim-report-form.component.html'
})
export class ClaimReportFormComponent extends MultiOrganizationQueryFormComponent {

  assessmentDefinition: AssessmentDefinition;

  /**
   * Responsible for tracking form validity
   */
  formGroup: FormGroup;

  /**
   * Determines whether or not the advanced filters section is visible
   */
  showAdvancedFilters = false;

  claimsBySubject = {};
  selectionBySubject = {};
  claimsCollapsed = true;

  private options: AggregateReportFormOptions;

  constructor(protected columnOrderableItemProvider: AggregateReportColumnOrderItemProvider,
              protected notificationService: NotificationService,
              protected optionMapper: AggregateReportOptionsMapper,
              protected organizationService: AggregateReportOrganizationService,
              protected reportService: AggregateReportService,
              protected requestMapper: AggregateReportRequestMapper,
              protected route: ActivatedRoute,
              protected router: Router,
              protected subgroupMapper: SubgroupMapper,
              protected tableDataService: AggregateReportTableDataService,
              @Inject(FormBuilder) formBuilder: FormBuilder,
              protected assessmentDefinitionService: AssessmentDefinitionService) {
    super(columnOrderableItemProvider, notificationService, optionMapper, organizationService, reportService, requestMapper, route, router, subgroupMapper, tableDataService);
    this.settings.reportType = AggregateReportType.Claim;
    this.options = optionMapper.map(this.aggregateReportOptions);

    this.assessmentDefinition = this.assessmentDefinitionService.get(this.settings.assessmentType, this.settings.reportType);

    this.updateColumnOrder();

    this.showAdvancedFilters = !SubgroupFilterSupport.equals(this.settings.studentFilters, this.aggregateReportOptions.studentFilters);

    this.formGroup = formBuilder.group({
      organizations: [
        this.organizations,
        control => {
          return this.includeStateResults
          || this.settings.includeAllDistricts
          || control.value.length
            ? null
            : { invalid: { messageId: 'aggregate-report-form.field.organization-invalid-error' } };
        }
      ],
      reportName: [
        this.settings.name,
        fileName({ messageId: 'aggregate-report-form.field.report-name-file-name-error' })
      ],
      assessmentGrades: [
        this.settings.claimReport.assessmentGrades,
        notEmpty({ messageId: 'aggregate-report-form.field.assessment-grades-empty-error' })
      ],
      schoolYears: [
        this.settings.claimReport.schoolYears,
        notEmpty({ messageId: 'aggregate-report-form.field.school-year-empty-error' })
      ]
    });

    this.initializeClaimsForAssessmentType();
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  getAssessmentDefinition(): AssessmentDefinition {
    return this.assessmentDefinition;
  }

  getNavItems(): ScrollNavItem[] {
    return [ {
      id: 'claimOrganizationSection',
      translationKey: 'aggregate-report-form.section.organization.heading'
    }, {
      id: 'claimAssessmentSection',
      translationKey: 'aggregate-report-form.section.assessment-heading'
    }, {
      id: 'claimSubgroupSection',
      translationKey: 'aggregate-report-form.section.comparative-subgroups-heading'
    }, {
      id: 'claimReviewSection',
      translationKey: 'aggregate-report-form.section.review-heading'
    }, {
      id: 'claimPreviewSection',
      translationKey: 'aggregate-report-form.section.preview-heading'
    } ];
  }

  getSupportedAssessmentTypes(): string[] {
    return [ 'sum', 'ica' ];
  }

  onAssessmentTypeChange(): void {
    this.assessmentDefinition = this.assessmentDefinitionService.get(this.settings.assessmentType, this.settings.reportType);

    this.updateColumnOrder();
    this.markOrganizationsControlTouched();
    this.initializeClaimsForAssessmentType();
    this.onSubjectsChange();
  }

  onSubjectsChange(): void {
    this.onClaimChange();
  }

  protected capableOfRowEstimation(): boolean {
    return (
      (
        // include state results
        this.includeStateResults
        // or anything include schools or districts
        || !Utils.isNullOrEmpty(this.settings.schools) || !Utils.isNullOrEmpty(this.settings.districts)
      )
      // and has at least one grade
      && !Utils.isNullOrEmpty(this.settings.claimReport.assessmentGrades)
      // and has at least one schools years
      && !Utils.isNullOrEmpty(this.settings.claimReport.schoolYears)
    );
  }

  onClaimChange() {
    this.settings.claimReport.claimCodesBySubject = this.getAllSelectedClaims();
    this.onSettingsChange();
  }

  private getAllSelectedClaims(): Claim[] {
    const claims: Claim[] = [];
    for (const subject of this.settings.subjects) {
      claims.push(...this.selectionBySubject[ subject ]);
    }
    return claims;
  }

  private initializeClaimsForAssessmentType(): void {
    this.filteredOptions.subjects.forEach(subject => {
      const subjectCode = subject.value;
      this.claimsBySubject[ subjectCode ] = this.filteredOptions.claimCodes
        .filter(claim => claim.value.subject === subjectCode
          && claim.value.assessmentType === this.settings.assessmentType)
        .sort(ScorableClaimOrderingProvider(subjectCode, claim => claim.value.code).compare);
    });

    this.initializeSelectionBySubject();
  }

  private initializeSelectionBySubject(): void {
    // Map selected claims by subject
    const selections: Map<string, Claim[]> = this.settings.claimReport.claimCodesBySubject
      .filter(claim => claim.assessmentType === this.settings.assessmentType)
      .reduce((map, claim) => {
        const subjectClaims = map.get(claim.subject) || [];
        subjectClaims.push(claim);
        map.set(claim.subject, subjectClaims);
        return map;
      }, new Map());

    for (let subject of this.settings.subjects) {
      if (selections.has(subject)) {
        // Initialize selection based on settings values
        this.selectionBySubject[ subject ] = selections.get(subject);
      } else {
        // Set selection to 'All'
        this.selectionBySubject[ subject ] = this.claimsBySubject[ subject ]
          .map(option => option.value);
      }
    }
  }

}
