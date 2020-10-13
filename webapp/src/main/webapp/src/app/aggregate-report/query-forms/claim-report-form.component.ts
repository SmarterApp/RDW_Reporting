import { Component } from '@angular/core';
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
import { SubgroupMapper } from '../subgroup/subgroup.mapper';
import { MultiOrganizationQueryFormComponent } from './multi-organization-query-form.component';
import { notEmpty } from '../../shared/form/validators';
import { AggregateReportFormOptions } from '../aggregate-report-form-options';
import { OrderingService } from '../../shared/ordering/ordering.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubjectService } from '../../subject/subject.service';
import { ReportQueryType } from '../../report/report';
import { UserQueryService } from '../../report/user-query.service';
import { canGetEstimatedRowCount } from '../support';
import { Claim } from '../aggregate-report-options';
import { SubgroupFilterSupport } from '../../shared/model/subgroup-filters';
import { SubjectDefinition } from '../../subject/subject';

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

  constructor(
    protected columnOrderableItemProvider: AggregateReportColumnOrderItemProvider,
    protected notificationService: NotificationService,
    protected optionMapper: AggregateReportOptionsMapper,
    protected organizationService: AggregateReportOrganizationService,
    protected reportService: AggregateReportService,
    protected userQueryService: UserQueryService,
    protected subjectService: SubjectService,
    protected requestMapper: AggregateReportRequestMapper,
    protected route: ActivatedRoute,
    protected router: Router,
    protected subgroupMapper: SubgroupMapper,
    protected tableDataService: AggregateReportTableDataService,
    protected formBuilder: FormBuilder,
    protected assessmentDefinitionService: AssessmentDefinitionService,
    protected orderingService: OrderingService
  ) {
    super(
      columnOrderableItemProvider,
      notificationService,
      optionMapper,
      organizationService,
      reportService,
      userQueryService,
      subjectService,
      requestMapper,
      route,
      router,
      subgroupMapper,
      tableDataService
    );
  }

  initialize(): void {
    super.initialize();

    this.settings.reportType = 'Claim';
    this.options = this.optionMapper.map(this.aggregateReportOptions);
    this.assessmentDefinition = this.assessmentDefinitionService.get(
      this.settings.assessmentType,
      this.settings.reportType
    );
    this.updateColumnOrder();
    this.showAdvancedFilters = !SubgroupFilterSupport.equals(
      this.settings.studentFilters,
      this.aggregateReportOptions.studentFilters
    );
    this.formGroup = this.formBuilder.group({
      organizations: [
        this.organizations,
        control => {
          return this.includeStateResults ||
            this.settings.includeAllDistricts ||
            control.value.length
            ? null
            : {
                invalid: {
                  messageId:
                    'aggregate-report-form.field.organization-invalid-error'
                }
              };
        }
      ],
      reportName: [this.settings.name],
      assessmentGrades: [
        this.settings.claimReport.assessmentGrades,
        notEmpty({
          messageId: 'aggregate-report-form.field.assessment-grades-empty-error'
        })
      ],
      schoolYears: [
        this.settings.claimReport.schoolYears,
        notEmpty({
          messageId: 'aggregate-report-form.field.school-year-empty-error'
        })
      ]
    });

    this.initializeClaimsForAssessmentType();
    this.onClaimChange();
  }

  get subjectDefinition(): SubjectDefinition {
    function getOptimalSubject(_settings) {
      for (const subject of _settings.subjects) {
        for (const claimCode of _settings.claimReport.claimCodesBySubject) {
          if (subject.code === claimCode.subject) {
            return subject;
          }
        }
      }
      return _settings.subjects[0];
    }

    const { settings } = this;
    return this.subjectDefinitions.find(
      x =>
        x.subject === getOptimalSubject(settings).code &&
        x.assessmentType === settings.assessmentType
    );
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  getAssessmentDefinition(): AssessmentDefinition {
    return this.assessmentDefinition;
  }

  getReportType(): ReportQueryType {
    return 'Claim';
  }

  getNavItems(): ScrollNavItem[] {
    return [
      {
        id: 'claimOrganizationSection',
        translationKey: 'aggregate-report-form.section.organization.heading'
      },
      {
        id: 'claimAssessmentSection',
        translationKey: 'aggregate-report-form.section.assessment-heading'
      },
      {
        id: 'claimSubgroupSection',
        translationKey:
          'aggregate-report-form.section.comparative-subgroups-heading'
      },
      {
        id: 'claimReviewSection',
        translationKey: 'aggregate-report-form.section.review-heading'
      },
      {
        id: 'claimPreviewSection',
        translationKey: 'aggregate-report-form.section.preview-heading'
      }
    ];
  }

  getSupportedAssessmentTypes(): string[] {
    return ['sum', 'ica'];
  }

  onAssessmentTypeChange(): void {
    this.assessmentDefinition = this.assessmentDefinitionService.get(
      this.settings.assessmentType,
      this.settings.reportType
    );

    this.updateColumnOrder();
    this.markOrganizationsControlTouched();
    this.updateSubjectsEnabled();
    this.initializeClaimsForAssessmentType();
    this.onSubjectsChange();
  }

  onSubjectsChange(): void {
    this.onClaimChange();
  }

  capableOfRowEstimation(): boolean {
    const {
      schools,
      districts,
      claimReport: { assessmentGrades, schoolYears }
    } = this.settings;
    return canGetEstimatedRowCount(
      this.includeStateResults,
      schools,
      districts,
      assessmentGrades,
      schoolYears
    );
  }

  onClaimChange() {
    this.settings.claimReport.claimCodesBySubject = this.getAllSelectedClaims();
    this.onSettingsChange();
  }

  private getAllSelectedClaims(): Claim[] {
    const claims: Claim[] = [];
    for (const subject of this.settings.subjects) {
      claims.push(...this.selectionBySubject[subject.code]);
    }
    return claims;
  }

  private initializeClaimsForAssessmentType(): void {
    const orderingObservables: Observable<
      boolean
    >[] = this.filteredOptions.subjects.map(subject => {
      const subjectCode = subject.value.code;
      return this.orderingService
        .getScorableClaimOrdering(subjectCode, this.settings.assessmentType)
        .pipe(
          map(claimOrdering => {
            this.claimsBySubject[
              subjectCode
            ] = this.filteredOptions.claimCodes
              .filter(
                claim =>
                  claim.value.subject === subjectCode &&
                  claim.value.assessmentType === this.settings.assessmentType
              )
              .sort(claimOrdering.on<any>(claim => claim.value.code).compare);
            return true;
          })
        );
    });

    // Once the orderings have been fetched, continue initialization
    forkJoin(...orderingObservables).subscribe(() => {
      this.initializeSelectionBySubject();
    });
  }

  private initializeSelectionBySubject(): void {
    // Selections must match exactly with the values used as options.
    const findMatching = input => {
      return this.claimsBySubject[input.subject]
        .map(opt => opt.value)
        .find(
          claim =>
            claim.code === input.code &&
            claim.assessmentType === input.assessmentType
        );
    };

    // Map selected claims by subject
    const selections: Map<
      string,
      Claim[]
    > = this.settings.claimReport.claimCodesBySubject
      .filter(claim => claim.assessmentType === this.settings.assessmentType)
      .reduce((subjectMap, claim) => {
        const subjectClaims = subjectMap.get(claim.subject) || [];
        const claimFromOption = findMatching(claim);
        if (claimFromOption) {
          subjectClaims.push(claimFromOption);
          subjectMap.set(claim.subject, subjectClaims);
        }
        subjectMap.set(claim.subject, subjectClaims);
        return subjectMap;
      }, new Map());

    const subjectCodes = this.settings.subjects.map(subject => subject.code);
    for (const subject of subjectCodes) {
      if (selections.has(subject)) {
        // Initialize selection based on settings values
        this.selectionBySubject[subject] = selections.get(subject);
      } else {
        // Set selection to 'All'
        this.selectionBySubject[subject] = this.claimsBySubject[subject].map(
          option => option.value
        );
      }
    }
  }
}
