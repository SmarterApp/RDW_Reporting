import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupportedRowCount } from './aggregate-report-table.component';
import { AggregateReportOptions } from '../aggregate-report-options';
import { AggregateReportItemMapper } from './aggregate-report-item.mapper';
import { AssessmentDefinition } from '../assessment/assessment-definition';
import { forkJoin, interval, Subscription } from 'rxjs';
import { Utils } from '../../shared/support/support';
import { Comparator, join, ranking } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { DisplayOptionService } from '../../shared/display-options/display-option.service';
import { TranslateService } from '@ngx-translate/core';
import { AggregateReportRequestMapper } from '../aggregate-report-request.mapper';
import { SpinnerModal } from '../../shared/loading/spinner.modal';
import { OrderableItem } from '../../shared/order-selector/order-selector.component';
import { AggregateReportColumnOrderItemProvider } from '../aggregate-report-column-order-item.provider';
import { AggregateReportRequestSummary } from '../aggregate-report-summary.component';
import { finalize, switchMap } from 'rxjs/operators';
import {
  LongitudinalCohortChart,
  OrganizationPerformance
} from './longitudinal-cohort-chart';
import {
  AggregateReportService,
  LongitudinalReport
} from '../aggregate-report.service';
import { LongitudinalCohortChartMapper } from './longitudinal-cohort-chart.mapper';
import { AggregateReportItem } from './aggregate-report-item';
import { organizationOrdering, subgroupOrdering } from '../support';
import { LongitudinalDisplayType } from '../../shared/display-options/longitudinal-display-type';
import { AssessmentDefinitionService } from '../assessment/assessment-definition.service';
import { SubjectService } from '../../subject/subject.service';
import { SubjectDefinition } from '../../subject/subject';
import { ValueDisplayTypes } from '../../shared/display-options/value-display-type';
import { PerformanceLevelDisplayTypes } from '../../shared/display-options/performance-level-display-type';
import { AggregateTargetOverview } from './aggregate-target-overview';
import { createTargetOverview } from './aggregate-target-overviews';
import {
  AggregateReportQueryType,
  LongitudinalReportQuery,
  ReportQueryType,
  TargetReportQuery,
  UserReport
} from '../../report/report';

const PollingInterval = 4000;

interface AggregateReportTableDisplayOptions {
  readonly valueDisplayTypes: any[];
  readonly performanceLevelDisplayTypes: any[];
  readonly longitudinalDisplayTypes: any[];
}

interface AggregateReportView {
  targetOverview?: AggregateTargetOverview;

  originalRows: AggregateReportItem[];
  rows: AggregateReportItem[];
  subjectDefinition: SubjectDefinition;
  options: AggregateReportOptions;
  reportType: ReportQueryType;

  valueDisplayType: string;
  performanceLevelDisplayType: string;
  columnOrdering: string[];
  columnOrderingItems: OrderableItem[];
  chart?: LongitudinalCohortChart;
  showEmpty: boolean;
  emptyRowCount: number;
}

enum ViewState {
  ReportProcessing,
  ReportEmpty,
  ReportNotLoadable,
  ReportSizeNotSupported,
  ReportView
}

function toViewState(
  report: UserReport,
  displayLargeReport: boolean
): ViewState {
  if (report.status === 'PENDING' || report.status === 'RUNNING') {
    return ViewState.ReportProcessing;
  }
  if (report.status === 'NO_RESULTS') {
    return ViewState.ReportEmpty;
  }
  if (report.status !== 'COMPLETED') {
    return ViewState.ReportNotLoadable;
  }
  if (!isSupportedSize(report) && !displayLargeReport) {
    return ViewState.ReportSizeNotSupported;
  }
  if (report.status === 'COMPLETED') {
    return ViewState.ReportView;
  }
  return ViewState.ReportProcessing;
}

function isSupportedSize(report: UserReport): boolean {
  const rowCount: string = (report.metadata || {}).totalCount;
  return (
    Utils.isUndefined(rowCount) ||
    Number.parseInt(rowCount) <= SupportedRowCount
  );
}

/**
 * This component is responsible for performing the aggregate report query and
 * displaying the results.  Results are displayed in one table per subjectId.
 */
@Component({
  selector: 'aggregate-report',
  templateUrl: 'aggregate-report.component.html'
})
export class AggregateReportComponent implements OnInit, OnDestroy {
  readonly ViewState = ViewState;

  @ViewChild('spinnerModal')
  spinnerModal: SpinnerModal;

  assessmentDefinition: AssessmentDefinition;
  options: AggregateReportOptions;
  report: UserReport;
  query: AggregateReportQueryType;
  reportViews: AggregateReportView[];
  showRequest: boolean = false;
  summary: AggregateReportRequestSummary;
  longitudinalDisplayType = LongitudinalDisplayType.GeneralPopulation;
  viewState: ViewState;
  displayOptions: AggregateReportTableDisplayOptions;
  effectiveReportType: ReportQueryType;
  isLongitudinal: boolean;
  showTargetMathCautionMessage: boolean;
  userQueryId: string;

  private _viewComparator: Comparator<AggregateReportView>;
  private _pollingSubscription: Subscription;
  private _displayLargeReport: boolean = false;
  private _aggregateReport: any;
  private _subjectDefinitions: SubjectDefinition[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: AggregateReportService,
    private requestMapper: AggregateReportRequestMapper,
    private itemMapper: AggregateReportItemMapper,
    private displayOptionService: DisplayOptionService,
    private translateService: TranslateService,
    private definitionService: AssessmentDefinitionService,
    private columnOrderableItemProvider: AggregateReportColumnOrderItemProvider,
    private subjectService: SubjectService,
    private chartMapper: LongitudinalCohortChartMapper
  ) {
    const { options, report } = route.snapshot.data;
    const { userQueryId } = route.snapshot.queryParams;
    const query: AggregateReportQueryType = report.query;

    const assessmentDefinition = definitionService.get(
      query.assessmentTypeCode,
      query.type
    );

    this.userQueryId = userQueryId;
    this.options = options;
    this.report = report;
    this.query = query;
    this.assessmentDefinition = assessmentDefinition;

    this._viewComparator = ordering(
      ranking(options.subjects.map(subject => subject.code))
    ).on(
      (wrapper: AggregateReportView) => wrapper.subjectDefinition.subject
    ).compare;

    this.displayOptions = {
      valueDisplayTypes: displayOptionService.getValueDisplayTypeOptions(),
      performanceLevelDisplayTypes: displayOptionService.getPerformanceLevelDisplayTypeOptions(),
      longitudinalDisplayTypes: displayOptionService.getLongitudinalDisplayTypeOptions()
    };

    this.effectiveReportType = reportService.getEffectiveReportType(
      query.type,
      assessmentDefinition
    );

    this.isLongitudinal = query.type === 'Longitudinal';
    this.showTargetMathCautionMessage =
      query.type === 'Target' &&
      (<TargetReportQuery>query).subjectCode === 'Math';

    forkJoin(
      this.subjectService.getSubjectDefinitions(),
      this.requestMapper.toSettings(report.query, options)
    ).subscribe(([subjectDefinitions, settings]) => {
      this.summary = {
        assessmentDefinition,
        options,
        settings
      };
      this._subjectDefinitions = subjectDefinitions;
    });
  }

  ngOnInit(): void {
    this.updateViewState();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  onUpdateRequestButtonClick(): void {
    const { userQueryId } = this.route.snapshot.queryParams;
    const queryParams =
      userQueryId != null ? { userQueryId } : { userReportId: this.report.id };
    this.router.navigate(['..'], {
      relativeTo: this.route,
      queryParams
    });
  }

  onToggleRequestViewButtonClick(): void {
    this.showRequest = !this.showRequest;
  }

  onDisplayReportButtonClick(): void {
    this._displayLargeReport = true;
    this.updateViewState();
  }

  onDownloadDataButtonClick(): void {
    this.reportService.downloadReportContent(this.report.id);
    this.router.navigateByUrl('/reports');
  }

  getExportName(view: AggregateReportView): string {
    const subjectLabel: string = this.translateService.instant(
      `subject.${view.subjectDefinition.subject}.name`
    );
    return this.translateService.instant('aggregate-report.export-name', {
      label: this.report.query.name,
      subject: subjectLabel
    });
  }

  onColumnOrderChange(view: AggregateReportView, items: OrderableItem[]): void {
    view.columnOrdering = items.map(item => item.value);
  }

  onShowEmptyChange(view: AggregateReportView): void {
    view.rows = view.originalRows.filter(
      row => view.showEmpty || row.studentsTested > 0
    );
  }

  onLongitudinalDisplayTypeChange(): void {
    if (!this._aggregateReport) {
      return;
    }
    this.reportViews = this.createReportViews(
      this.query,
      this._aggregateReport
    );
  }

  private updateViewState(): void {
    const { viewState, report, _displayLargeReport } = this;
    const nextViewState = toViewState(report, _displayLargeReport);
    if (viewState !== nextViewState) {
      this.onViewStateChange(viewState, nextViewState);
      this.viewState = nextViewState;
    }
  }

  private onViewStateChange(oldState: ViewState, newState: ViewState) {
    if (oldState === ViewState.ReportProcessing) {
      this.unsubscribe();
    }
    if (newState === ViewState.ReportProcessing) {
      this.pollReport();
    }
    if (newState === ViewState.ReportView) {
      this.loadReport();
    }
  }

  private pollReport(): void {
    this._pollingSubscription = interval(PollingInterval)
      .pipe(switchMap(() => this.reportService.getReportById(this.report.id)))
      .subscribe(report => {
        this.report = report;
        this.updateViewState();
      });
  }

  private loadReport(): void {
    this.spinnerModal.loading = true;

    // Need to load subject definitions in case they are not loaded yet
    // this avoids race condition
    const observable = forkJoin(
      this.subjectService.getSubjectDefinitions(),
      this.effectiveReportType === 'Longitudinal'
        ? this.reportService.getLongitudinalReport(this.report.id)
        : this.reportService.getAggregateReport(this.report.id)
    );

    observable
      .pipe(
        finalize(() => {
          this.spinnerModal.loading = false;
        })
      )
      .subscribe(([subjectDefinitions, report]) => {
        this._subjectDefinitions = subjectDefinitions;
        this._aggregateReport = report;
        this.reportViews = this.createReportViews(this.query, report);
      });
  }

  private createReportViews(
    query: AggregateReportQueryType,
    report: any
  ): AggregateReportView[] {
    const {
      options,
      effectiveReportType: reportType,
      _subjectDefinitions,
      assessmentDefinition,
      columnOrderableItemProvider,
      longitudinalDisplayType,
      itemMapper,
      reportViews,
      chartMapper,
      _viewComparator
    } = this;

    const { rows, assessments } = report;
    const hasLongitudinalData = assessments != null;

    const measuresGetter =
      hasLongitudinalData &&
      longitudinalDisplayType == LongitudinalDisplayType.Cohort
        ? row => row.cohortMeasures
        : row => row.measures;

    const rowMapper: (
      query,
      subjectDefinition,
      row,
      index
    ) => AggregateReportItem = (query, subjectDefinition, row, index) =>
      itemMapper.createRow(
        query,
        subjectDefinition,
        row,
        index,
        measuresGetter
      );

    // Preserve existing display type choices if they exist
    const displayBySubject: Map<string, any> = (reportViews || []).reduce(
      (map, view) => {
        map.set(view.subjectDefinition.subject, {
          valueDisplayType: view.valueDisplayType,
          performanceLevelDisplayType: view.performanceLevelDisplayType
        });
        return map;
      },
      new Map()
    );

    return rows
      .reduce((views, row, index) => {
        const subjectCode = row.assessment.subjectCode;

        const subjectDefinition = _subjectDefinitions.find(
          ({ subject, assessmentType }) =>
            subject == subjectCode && assessmentType == query.assessmentTypeCode
        );

        const item = rowMapper(query, subjectDefinition, row, index);

        let view = views.find(
          ({ subjectDefinition: { subject } }) => subject === subjectCode
        );
        if (!view) {
          const columnOrdering: string[] = Utils.isNullOrEmpty(
            query.columnOrder
          )
            ? assessmentDefinition.aggregateReportIdentityColumns.concat()
            : query.columnOrder;

          const columnOrderingItems = columnOrderableItemProvider.toOrderableItems(
            columnOrdering
          );

          const displayTypes = displayBySubject.get(subjectCode) || {
            valueDisplayType:
              query.valueDisplayType || ValueDisplayTypes.Percent,
            performanceLevelDisplayType:
              subjectDefinition.overallScore.standardCutoff != null
                ? query.achievementLevelDisplayType ||
                  PerformanceLevelDisplayTypes.Separate
                : undefined
          };

          const showEmpty =
            typeof query.showEmpty !== 'undefined' ? query.showEmpty : true;

          view = <any>{
            subjectDefinition,
            originalRows: [item],
            options,
            reportType,
            showEmpty,
            columnOrdering,
            columnOrderingItems,
            ...displayTypes
          };

          if (hasLongitudinalData) {
            view.chart = chartMapper.fromReport(
              <LongitudinalReportQuery>query,
              <LongitudinalReport>{
                rows: rows.filter(
                  row => row.assessment.subjectCode === subjectCode
                ),
                assessments: assessments.filter(
                  assessment => assessment.subject === subjectCode
                )
              },
              measuresGetter,
              subjectDefinition
            );

            view.chart.organizationPerformances.sort(
              join(
                organizationOrdering(
                  (path: OrganizationPerformance) => path.organization,
                  view.chart.organizationPerformances
                ).compare,
                subgroupOrdering(
                  (path: OrganizationPerformance) => path.subgroup,
                  options
                ).compare
              )
            );
          }

          views.push(view);
        } else {
          view.originalRows.push(item);
        }
        return views;
      }, [])
      .map(view => ({
        ...view,
        rows: view.originalRows.filter(
          row => view.showEmpty || row.studentsTested > 0
        ),
        emptyRowCount: view.originalRows.reduce(
          (count, row) => count + (row.studentsTested === 0 ? 1 : 0),
          0
        ),
        targetOverview:
          reportType === 'Target'
            ? createTargetOverview(
                view.originalRows.find(
                  row => row.subgroup.dimensionGroups[0].type === 'Overall'
                )
              )
            : undefined
      }))
      .sort(_viewComparator);
  }

  private unsubscribe(): void {
    if (this._pollingSubscription) {
      this._pollingSubscription.unsubscribe();
      this._pollingSubscription = undefined;
    }
  }
}
