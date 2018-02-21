import { Component, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReportService } from "../../report/report.service";
import { Report } from "../../report/report.model";
import { AggregateReportTable, SupportedRowCount } from "./aggregate-report-table.component";
import { Observable } from "rxjs/Observable";
import { AggregateReportOptions } from "../aggregate-report-options";
import { AggregateReportItemMapper } from "./aggregate-report-item.mapper";
import { AssessmentDefinition } from "../assessment/assessment-definition";
import { AggregateReportRow } from "../../report/aggregate-report";
import { Subscription } from "rxjs/Subscription";
import { Utils } from "../../shared/support/support";
import { Comparator, ranking } from "@kourge/ordering/comparator";
import { ordering } from "@kourge/ordering";
import { AggregateReportQuery } from "../../report/aggregate-report-request";
import { saveAs } from "file-saver";
import { DisplayOptionService } from "../../shared/display-options/display-option.service";
import { TranslateService } from "@ngx-translate/core";
import { AggregateReportRequestMapper } from "../aggregate-report-request.mapper";
import { SpinnerModal } from "../../shared/loading/spinner.modal";
import "rxjs/add/operator/finally";
import { OrderableItem } from "../../shared/order-selector/order-selector.component";
import { AggregateReportColumnOrderItemProvider } from "../aggregate-report-column-order-item.provider";
import { DefaultColumnOrder } from "../aggregate-report-options.mapper";
import { AggregateReportRequestSummary } from "../aggregate-report-summary.component";

const PollingInterval = 4000;

/**
 * This component is responsible for performing the aggregate report query and
 * displaying the results.  Results are displayed in one table per subjectId.
 */
@Component({
  selector: 'aggregate-report',
  templateUrl: 'aggregate-report.component.html',
})
export class AggregateReportComponent implements OnDestroy {

  @ViewChild('spinnerModal')
  spinnerModal: SpinnerModal;

  assessmentDefinition: AssessmentDefinition;
  options: AggregateReportOptions;
  report: Report;
  reportTables: AggregateReportTableView[];
  showRequest: boolean = false;
  summary: AggregateReportRequestSummary;

  private _tableViewComparator: Comparator<AggregateReportTableView>;
  private _pollingSubscription: Subscription;
  private _displayLargeReport: boolean = false;
  private _displayOptions: AggregateReportTableDisplayOptions;
  private _viewState: ViewState;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private reportService: ReportService,
              private requestMapper: AggregateReportRequestMapper,
              private itemMapper: AggregateReportItemMapper,
              private displayOptionService: DisplayOptionService,
              private translateService: TranslateService,
              private columnOrderableItemProvider: AggregateReportColumnOrderItemProvider) {

    this.options = this.route.snapshot.data[ 'options' ];
    this.report = this.route.snapshot.data[ 'report' ];
    this.assessmentDefinition = this.route.snapshot.data[ 'assessmentDefinitionsByAssessmentTypeCode' ]
      .get(this.report.request.reportQuery.assessmentTypeCode);
    this._tableViewComparator = ordering(ranking(this.options.subjects))
      .on((wrapper: AggregateReportTableView) => wrapper.subjectCode).compare;
    this._displayOptions = {
      valueDisplayTypes: this.displayOptionService.getValueDisplayTypeOptions(),
      performanceLevelDisplayTypes: this.displayOptionService.getPerformanceLevelDisplayTypeOptions()
    };
    this.requestMapper.toSettings(this.report.request, this.options)
      .subscribe(settings => this.summary = {
        assessmentDefinition: this.assessmentDefinition,
        options: this.options,
        settings: settings
      });
    this.updateViewState();
  }

  get displayOptions(): AggregateReportTableDisplayOptions {
    return this._displayOptions;
  }

  get query(): AggregateReportQuery {
    return this.report.request.reportQuery;
  }

  get reportProcessing(): boolean {
    return this._viewState === ViewState.ReportProcessing;
  }

  get reportNotLoadable(): boolean {
    return this._viewState === ViewState.ReportNotLoadable;
  }

  get reportSizeNotSupported(): boolean {
    return this._viewState === ViewState.ReportSizeNotSupported;
  }

  get reportView(): boolean {
    return this._viewState === ViewState.ReportView;
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  onUpdateRequestButtonClick(): void {
    this.router.navigate([ '..' ], { relativeTo: this.route, queryParams: { src: this.report.id } });
  }

  onToggleRequestViewButtonClick(): void {
    this.showRequest = !this.showRequest;
  }

  onDisplayReportButtonClick(): void {
    this._displayLargeReport = true;
    this.updateViewState();
  }

  onDownloadDataButtonClick(): void {
    this.spinnerModal.loading = true;
    this.reportService.getReportContent(this.report.id)
      .finally(() => {
        this.spinnerModal.loading = false;
      })
      .subscribe(download => {
        saveAs(download.content, download.name);
      });
  }

  getExportName(table: AggregateReportTableView): string {
    const subjectLabel: string = this.translateService.instant(`common.subject.${table.subjectCode}.short-name`);
    return this.translateService.instant('aggregate-reports.export-name', {
      label: this.report.label,
      subject: subjectLabel
    });
  }

  onColumnOrderChange(tableView: AggregateReportTableView, items: OrderableItem[]) {
    tableView.columnOrdering = items.map(item => item.value);
  }

  private updateViewState(): void {
    let targetViewState: ViewState = this.getTargetViewState();
    this.onViewStateChange(this._viewState, targetViewState);
    this._viewState = targetViewState;
  }

  private getTargetViewState(): ViewState {
    if (this.report.processing) {
      return ViewState.ReportProcessing;
    }
    if (!this.report.loadable) {
      return ViewState.ReportNotLoadable;
    }
    if (!this.isSupportedSize(this.report) && !this._displayLargeReport) {
      return ViewState.ReportSizeNotSupported;
    }
    if (this.report.completed) {
      return ViewState.ReportView;
    }
    return ViewState.ReportProcessing;
  }

  private onViewStateChange(oldState: ViewState, newState: ViewState) {
    if (oldState == newState) {
      return;
    }

    if (oldState == ViewState.ReportProcessing) {
      this.unsubscribe();
    }
    if (newState == ViewState.ReportProcessing) {
      this.pollReport();
    }
    if (newState == ViewState.ReportView) {
      this.loadReport();
    }
  }

  private pollReport(): void {
    this._pollingSubscription = Observable.interval(PollingInterval)
      .switchMap(() => this.reportService.getReportById(this.report.id))
      .subscribe(report => {
        this.report = report;
        this.updateViewState();
      });
  }

  private isSupportedSize(report: Report): boolean {
    const rowCount: string = this.report.metadata.totalCount;
    return Utils.isUndefined(rowCount)
      || (Number.parseInt(rowCount) <= SupportedRowCount);
  }

  private loadReport(): void {
    this.reportService.getAggregateReport(this.report.id)
      .subscribe(rows => this.initializeReportTables(rows));
  }

  private initializeReportTables(rows: AggregateReportRow[]): void {
    this.reportTables = rows.reduce((tableWrappers, row, index) => {
      const item = this.itemMapper.map(this.assessmentDefinition, row, index);
      const subjectCode = row.assessment.subjectCode;
      const tableWrapper = tableWrappers.find(wrapper => wrapper.subjectCode == subjectCode);
      const columnOrder: string[] = Utils.isNullOrEmpty(this.report.request.reportQuery.columnOrder)
        ? DefaultColumnOrder
        : this.report.request.reportQuery.columnOrder;
      if (!tableWrapper) {
        tableWrappers.push({
          subjectCode: subjectCode,
          table: {
            options: this.options,
            assessmentDefinition: this.assessmentDefinition,
            rows: [ item ]
          },
          valueDisplayType: this.query.valueDisplayType,
          performanceLevelDisplayType: this.query.achievementLevelDisplayType,
          columnOrdering: columnOrder,
          columnOrderingItems: this.columnOrderableItemProvider.toOrderableItems(columnOrder)
        });
      } else {
        tableWrapper.table.rows.push(item);
      }
      return tableWrappers;
    }, []).sort(this._tableViewComparator);
  }

  private unsubscribe(): void {
    if (this._pollingSubscription) {
      this._pollingSubscription.unsubscribe();
      this._pollingSubscription = undefined;
    }
  }

}

interface AggregateReportTableDisplayOptions {
  readonly valueDisplayTypes: any[];
  readonly performanceLevelDisplayTypes: any[];
}

interface AggregateReportTableView {
  subjectCode: string;
  table: AggregateReportTable;
  valueDisplayType: string;
  performanceLevelDisplayType: string;
  columnOrdering: string[];
  columnOrderingItems: OrderableItem[];
}

enum ViewState {
  ReportProcessing,
  ReportNotLoadable,
  ReportSizeNotSupported,
  ReportView
}
