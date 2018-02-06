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

  assessmentDefinitionsByAssessmentTypeCode: Map<string, AssessmentDefinition>;
  options: AggregateReportOptions;
  report: Report;
  reportTables: AggregateReportTable[];
  reportSizeSupported: boolean;
  pollingSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private reportService: ReportService,
              private itemMapper: AggregateReportItemMapper) {

    this.assessmentDefinitionsByAssessmentTypeCode = this.route.snapshot.data[ 'assessmentDefinitionsByAssessmentTypeCode' ];
    this.options = this.route.parent.snapshot.data[ 'options' ];
    this.report = this.route.snapshot.data[ 'report' ];
    this.reportSizeSupported = Number.parseInt(this.report.metadata.totalCount) < SupportedRowCount;
  }

  get loading(): boolean {
    return this.reportSizeSupported && !this.reportTables;
  }

  get dimensionRanking(): string[] {
    return this.options.dimensionTypes;
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

    const subjects = this.options.subjects;
    const assessmentDefinition = this.assessmentDefinitionsByAssessmentTypeCode.get(this.report.request.reportQuery.assessmentTypeCode);

    this.reportTables = rows.reduce((tables, row, index) => {

      const item = this.itemMapper.map(assessmentDefinition, row, index);
      const subject = subjects.find(option => option.code === row.assessment.subjectCode);
      const table = tables.find(table => table.subjectCode === subject.code);

      if (!table) {
        tables.push({
          subjectCode: subject.code,
          assessmentDefinition: assessmentDefinition,
          rows: [ item ]
        });
      } else {
        table.rows.push(item);
      }

      return tables;
    }, []).sort((a, b) => {
      const rank = (x) => subjects.findIndex(subject => subject.code === x.code);
      return rank(a) - rank(b);
    })
  }

  private unsubscribe(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
  }

}
