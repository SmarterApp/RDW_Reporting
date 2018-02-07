import { Component, OnDestroy, OnInit } from "@angular/core";
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

const PollingInterval = 4000;

/**
 * This component is responsible for performing the aggregate report query and
 * displaying the results.  Results are displayed in one table per subjectId.
 */
@Component({
  selector: 'aggregate-report',
  templateUrl: './aggregate-report.component.html',
})
export class AggregateReportComponent implements OnInit, OnDestroy {

  assessmentDefinition: AssessmentDefinition;
  options: AggregateReportOptions;
  report: Report;
  reportTables: AggregateReportTableView[];
  reportSizeSupported: boolean;
  pollingSubscription: Subscription;
  private _tableViewComparator: Comparator<AggregateReportTableView>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private reportService: ReportService,
              private itemMapper: AggregateReportItemMapper) {

    this.options = this.route.snapshot.data[ 'options' ];
    this.report = this.route.snapshot.data[ 'report' ];
    this.assessmentDefinition = this.route.snapshot.data[ 'assessmentDefinitionsByAssessmentTypeCode' ]
      .get(this.report.request.reportQuery.assessmentTypeCode);
    this.reportSizeSupported = Utils.isUndefined(this.report.metadata.totalCount)
      || (Number.parseInt(this.report.metadata.totalCount) <= SupportedRowCount);
    this._tableViewComparator = ordering(ranking(this.options.subjects.map(subject => subject.code)))
      .on((wrapper: AggregateReportTableView) => wrapper.subjectCode).compare;
  }

  get loading(): boolean {
    return this.reportSizeSupported && !this.reportTables;
  }

  get query(): AggregateReportQuery {
    return this.report.request.reportQuery;
  }

  ngOnInit(): void {
    if (this.reportSizeSupported) {
      this.loadOrPollReportStatus();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  onUpdateRequestButtonClick(): void {
    this.router.navigate([ '..' ], { relativeTo: this.route });
  }

  private loadOrPollReportStatus(): void {
    if (this.report.completed) {
      this.loadReport();
    } else {
      this.pollingSubscription = Observable.interval(PollingInterval)
        .switchMap(() => this.reportService.getReportById(this.report.id))
        .subscribe(report => {
          if (report.completed) {
            this.unsubscribe();
            this.loadReport();
          }
        });
    }
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
          }
        });
      } else {
        tableWrapper.table.rows.push(item);
      }
      return tableWrappers;
    }, []).sort(this._tableViewComparator);
  }

  private unsubscribe(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
  }

}

interface AggregateReportTableView {
  subjectCode: string;
  table: AggregateReportTable;
}
