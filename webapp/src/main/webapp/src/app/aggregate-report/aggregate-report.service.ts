import {Injectable} from "@angular/core";
import {DataService} from "../shared/data/data.service";
import {Observable} from "rxjs/Observable";
import {AggregateServiceRoute} from "../shared/service-route";
import {ReportService} from "../report/report.service";
import {Report} from "../report/report.model";
import {AggregateReportQuery, AggregateReportRequest} from "../report/aggregate-report-request";
import {AggregateReportRow} from "../report/aggregate-report";
import {AssessmentService} from "./assessment/assessment.service";
import {map} from "rxjs/operators";
import {Assessment} from "./assessment/assessment";


export interface LongitudinalReport {
  readonly query: AggregateReportQuery;
  readonly rows: AggregateReportRow[];
  readonly assessments: Assessment[];
}

/**
 * Responsible for interfacing with aggregate report server
 */
@Injectable()
export class AggregateReportService {

  constructor(private dataService: DataService,
              private reportService: ReportService,
              private assessmentService: AssessmentService) {
  }

  /**
   * Gets the estimated report row count for the provided report request
   *
   * @param {AggregateReportQuery} query the report parameters
   * @returns {Observable<number>} the row count
   */
  getEstimatedRowCount(query: AggregateReportQuery): Observable<number> {
    return this.dataService.post(`${AggregateServiceRoute}/aggregate/estimatedRowCount`, query);
  }

  /**
   * Creates an aggregate report
   *
   * @param {AggregateReportRequest} request the report parameters
   * @returns {Observable<Report>} the report resource handle
   */
  createReport(request: AggregateReportRequest): Observable<Report> {
    return this.reportService.createAggregateReport(request);
  }

  /**
   * Gets a single aggregate report by ID
   *
   * @param {number} id the report ID
   * @returns {Observable<Report>} the report resource handle
   */
  getReportById(id: number): Observable<Report> {
    return this.reportService.getReportById(id);
  }

  getAggregateReport(id: number): Observable<AggregateReportRow[]> {
    return this.reportService.getAggregateReport(id);
  }

  downloadReportContent(id: number): void {
    return this.reportService.downloadReportContent(id);
  }

  getLongitudinalReport(id: number): Observable<LongitudinalReport> {
    return this.getAggregateReport(id)
      .flatMap(rows => {
        return this.assessmentService.getAssessments({
          ids: rows.reduce((ids, row: AggregateReportRow) => {
            if (ids.indexOf(row.assessment.id) === -1) {
              ids.push(row.assessment.id);
            }
            return ids;
          }, [])
        }).pipe(
          map(assessments => <LongitudinalReport>{ rows, assessments })
        )
      });
  }

}
