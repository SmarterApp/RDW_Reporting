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
import { AltScore } from '../aggregate-report-options';
import { SubgroupFilterSupport } from '../../shared/model/subgroup-filters';
import { SubjectDefinition } from '../../subject/subject';

@Component({
  selector: 'alt-score-report-form',
  templateUrl: './alt-score-report-form.component.html'
})
export class AltScoreReportFormComponent extends MultiOrganizationQueryFormComponent {
  assessmentDefinition: AssessmentDefinition;

  /**
   * Responsible for tracking form validity
   */
  formGroup: FormGroup;

  /**
   * Determines whether or not the advanced filters section is visible
   */
  showAdvancedFilters = false;

  altScoresBySubject = {};
  selectionBySubject = {};
  altScoresCollapsed = true;

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

    this.settings.reportType = 'AltScore';
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
        this.settings.altScoreReport.assessmentGrades,
        notEmpty({
          messageId: 'aggregate-report-form.field.assessment-grades-empty-error'
        })
      ],
      schoolYears: [
        this.settings.altScoreReport.schoolYears,
        notEmpty({
          messageId: 'aggregate-report-form.field.school-year-empty-error'
        })
      ]
    });

    this.initializeAltScoresForAssessmentType();
    this.onAltScoreChange();
  }

  get subjectDefinition(): SubjectDefinition {
    function getOptimalSubject(_settings) {
      for (const subject of _settings.subjects) {
        for (const altScoreCode of _settings.altScoreReport
          .altScoreCodesBySubject) {
          if (subject.code === altScoreCode.subject) {
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
    return 'AltScore';
  }

  getNavItems(): ScrollNavItem[] {
    return [
      {
        id: 'altScoreOrganizationSection',
        translationKey: 'aggregate-report-form.section.organization.heading'
      },
      {
        id: 'altScoreAssessmentSection',
        translationKey: 'aggregate-report-form.section.assessment-heading'
      },
      {
        id: 'altScoreSubgroupSection',
        translationKey:
          'aggregate-report-form.section.comparative-subgroups-heading'
      },
      {
        id: 'altScoreReviewSection',
        translationKey: 'aggregate-report-form.section.review-heading'
      },
      {
        id: 'altScorePreviewSection',
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
    this.initializeAltScoresForAssessmentType();
    this.onSubjectsChange();
  }

  onSubjectsChange(): void {
    this.onAltScoreChange();
  }

  capableOfRowEstimation(): boolean {
    const {
      schools,
      districts,
      altScoreReport: { assessmentGrades, schoolYears }
    } = this.settings;
    return canGetEstimatedRowCount(
      this.includeStateResults,
      schools,
      districts,
      assessmentGrades,
      schoolYears
    );
  }

  onAltScoreChange() {
    this.settings.altScoreReport.altScoreCodesBySubject = this.getAllSelectedAltScores();
    this.onSettingsChange();
  }

  private getAllSelectedAltScores(): AltScore[] {
    const altScores: AltScore[] = [];
    for (const subject of this.settings.subjects) {
      altScores.push(...this.selectionBySubject[subject.code]);
    }
    return altScores;
  }

  private initializeAltScoresForAssessmentType(): void {
    // TODO: replace deprecated code
    const orderingObservables: Observable<
      boolean
    >[] = this.filteredOptions.subjects.map(subject => {
      const subjectCode = subject.value.code;
      return this.orderingService
        .getAltScoreOrdering(subjectCode, this.settings.assessmentType)
        .pipe(
          map(altScoreOrdering => {
            this.altScoresBySubject[
              subjectCode
            ] = this.filteredOptions.altScoreCodes
              .filter(
                altScore =>
                  altScore.value.subject === subjectCode &&
                  altScore.value.assessmentType === this.settings.assessmentType
              )
              .sort(
                altScoreOrdering.on<any>(altScore => altScore.value.code)
                  .compare
              );
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
      return this.altScoresBySubject[input.subject]
        .map(opt => opt.value)
        .find(
          altScore =>
            altScore.code === input.code &&
            altScore.assessmentType === input.assessmentType
        );
    };

    const selections: Map<
      string,
      AltScore[]
    > = this.settings.altScoreReport.altScoreCodesBySubject
      .filter(
        altScore => altScore.assessmentType === this.settings.assessmentType
      )
      .reduce((subjectMap, altScore) => {
        const subjectAltScores = subjectMap.get(altScore.subject) || [];
        const altScoreFromOption = findMatching(altScore);
        if (altScoreFromOption) {
          subjectAltScores.push(altScoreFromOption);
          subjectMap.set(altScore.subject, subjectAltScores);
        }
        return subjectMap;
      }, new Map());

    const subjectCodes = this.settings.subjects.map(subject => subject.code);
    for (const subject of subjectCodes) {
      if (selections.has(subject)) {
        // Initialize selection based on settings values
        this.selectionBySubject[subject] = selections.get(subject);
      } else {
        // Set selection to 'All'
        this.selectionBySubject[subject] = this.altScoresBySubject[subject].map(
          option => option.value
        );
      }
    }
  }
}
