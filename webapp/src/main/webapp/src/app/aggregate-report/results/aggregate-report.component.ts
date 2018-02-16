import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
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
import { SpinnerModal } from "../../shared/loading/spinner.modal";

const PollingInterval = 4000;

/**
 * This component is responsible for performing the aggregate report query and
 * displaying the results.  Results are displayed in one table per subjectId.
 */
@Component({
  selector: 'aggregate-report',
  templateUrl: 'aggregate-report.component.html',
})
export class AggregateReportComponent implements OnInit, OnDestroy {

  @ViewChild('spinnerModal')
  spinnerModal: SpinnerModal;

  assessmentDefinition: AssessmentDefinition;
  options: AggregateReportOptions;
  report: Report;
  reportTables: AggregateReportTableView[];
  private _tableViewComparator: Comparator<AggregateReportTableView>;
  private _pollingSubscription: Subscription;
  private _displayLargeReport: boolean = false;
  private _displayOptions: AggregateReportTableDisplayOptions;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private reportService: ReportService,
              private itemMapper: AggregateReportItemMapper,
              private displayOptionService: DisplayOptionService,
              private translateService: TranslateService) {

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
  }

  get displayOptions(): AggregateReportTableDisplayOptions {
    return this._displayOptions;
  }

  get query(): AggregateReportQuery {
    return this.report.request.reportQuery;
  }

  get viewState(): ViewState {
    if (this.report.processing) {
      return ViewState.ReportProcessing;
    }
    if (!this.report.loadable) {
      return ViewState.ReportNotLoadable;
    }
    if (!this.isSupportedSize(this.report) && !this._displayLargeReport) {
      return ViewState.ReportSizeNotSupported;
    }
    if (!Utils.isUndefined(this.reportTables) || this._displayLargeReport) {
      return ViewState.ReportView;
    }
    return ViewState.ReportProcessing;
  }

  get reportProcessing(): boolean {
    return this.viewState === ViewState.ReportProcessing;
  }

  get reportNotLoadable(): boolean {
    return this.viewState === ViewState.ReportNotLoadable;
  }

  get reportSizeNotSupported(): boolean {
    return this.viewState === ViewState.ReportSizeNotSupported;
  }

  get reportView(): boolean {
    return this.viewState === ViewState.ReportView;
  }

  ngOnInit(): void {
    this.loadOrPollReport();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  onUpdateRequestButtonClick(): void {
    this.router.navigate([ '..' ], { relativeTo: this.route, queryParams: { src: this.report.id } });
  }

  onDisplayReportButtonClick(): void {
    this._displayLargeReport = true;
    this.loadReport();
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

  private loadOrPollReport(): void {
    if (this.report.completed) {
      this.loadReport();
    } else if (this.report.processing) {
      this.pollReport();
    }
  }

  private pollReport(): void {
    this._pollingSubscription = Observable.interval(PollingInterval)
      .switchMap(() => this.reportService.getReportById(this.report.id))
      .subscribe(report => {
        if (!report.processing) {
          this.unsubscribe();
        }
        if (report.completed) {
          this.loadReport();
        }
        this.report = report;
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
      if (!tableWrapper) {
        tableWrappers.push({
          subjectCode: subjectCode,
          table: {
            options: this.options,
            assessmentDefinition: this.assessmentDefinition,
            rows: [ item ]
          },
          valueDisplayType: this.query.valueDisplayType,
          performanceLevelDisplayType: this.query.achievementLevelDisplayType
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
}

enum ViewState {
  ReportProcessing,
  ReportNotLoadable,
  ReportSizeNotSupported,
  ReportView
}
