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
import { Option as SbCheckboxGroupOption } from '../../shared/form/sb-checkbox-group.component';
import { Claim } from '../aggregate-report-options.service';

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

  collapsed = true;

  claimsBySubject = {};
  selectionBySubject = {};

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
    this.settings.reportType = 'Claim';
    this.options = optionMapper.map(this.aggregateReportOptions);

    this.assessmentDefinition = this.assessmentDefinitionService.get(this.settings.assessmentType, this.settings.reportType);

    this.filterClaimCodes();
    if (this.settings.claimReport.claimCodesBySubject.length === 0) {
      // selected All
      this.filteredOptions.claimCodes.forEach(claim => {
        this.settings.claimReport.claimCodesBySubject.push(claim.value);
      });
    }

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
  }

  setClaimsBySubject(): void {
    this.claimsBySubject = {};
    const subjects = this.options.subjects.map(
      subject => subject.value);
    for (const subject of subjects) {
      this.claimsBySubject[ subject ] = this.filteredOptions.claimCodes.filter(claim => claim.value.subject === subject);
    }
  }

  setSelectionBySubject(): void {
    this.selectionBySubject = {};
    const subjects = this.options.subjects.map(
      subject => subject.value);
    for (const subject of subjects) {
      this.selectionBySubject[ subject ] = this.settings.claimReport.claimCodesBySubject;
    }
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
    this.onSettingsChange();
  }

  onSubjectsChange(): void {
    this.filterClaimCodes();
    this.onSettingsChange();
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

  private filterClaimCodes(): void {
    this.setClaimsBySubject();
    this.setSelectionBySubject();
    this.filteredOptions.claimCodes = this.options.claimCodes.filter((claim: SbCheckboxGroupOption) => {
      return claim.value.assessmentType === this.settings.assessmentType && this.settings.subjects.includes(claim.value.subject);
    });
  }

  get selectedClaimsBySubject(): Claim[] {
    const claims = [];
    for (const subject in this.selectionBySubject) {
      claims.push(...this.selectionBySubject[ subject ]);
    }
    return claims;
  }

  onClaimChange() {
    this.settings.claimReport.claimCodesBySubject = this.selectedClaimsBySubject;
    super.onSettingsChange();
  }
}
