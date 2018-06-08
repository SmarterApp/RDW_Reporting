import { Injectable } from '@angular/core';
import { DataService } from '../shared/data/data.service';
import { Observable } from 'rxjs/Observable';
import { AggregateServiceRoute } from '../shared/service-route';
import { ReportService } from '../report/report.service';
import { Report } from '../report/report.model';
import { AggregateReportQuery, AggregateReportRequest } from '../report/aggregate-report-request';
import { AggregateReportRow } from '../report/aggregate-report';
import { AssessmentService } from './assessment/assessment.service';
import { map } from 'rxjs/operators';
import { Assessment } from './assessment/assessment';
import { AssessmentDefinition } from './assessment/assessment-definition';
import { TargetService } from "../shared/target/target.service";
import { Target } from "../assessments/model/target.model";
import { of } from "rxjs/observable/of";
import { AggregateReportType } from "./aggregate-report-form-settings";

export interface BasicReport {
  readonly rows: AggregateReportRow[];
}

export interface LongitudinalReport extends BasicReport {
  readonly assessments: Assessment[];
}

const DefaultReportType: AggregateReportType = AggregateReportType.GeneralPopulation;

/**
 * Responsible for interfacing with aggregate report server
 */
@Injectable()
export class AggregateReportService {

  constructor(private dataService: DataService,
              private reportService: ReportService,
              private assessmentService: AssessmentService,
              private targetService: TargetService) {
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
   * Gets the effective report type
   *
   * @param {AggregateReportType} reportType the report type
   * @param {AssessmentDefinition} definition the assessment definition
   * @returns {AggregateReportType}
   */
  getEffectiveReportType(reportType: AggregateReportType, definition: AssessmentDefinition): AggregateReportType {
    return definition.aggregateReportTypes.includes(reportType)
      ? reportType
      : DefaultReportType;
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

  getAggregateReport(id: number): Observable<BasicReport> {
    return this.reportService.getAggregateReport(id).pipe(
      map(rows => <BasicReport>{ rows })
    );
  }

  downloadReportContent(id: number): void {
    return this.reportService.downloadReportContent(id);
  }

  getLongitudinalReport(id: number): Observable<LongitudinalReport> {
    return this.getAggregateReport(id)
      .flatMap(({ rows }) => {
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

  /**
   *
   * @param {number} id
   * @returns {Observable<BasicReport>}
   * @deprecated With configurable subjects, we should get target display text via translation
   */
  getTargetReport(id: number): Observable<BasicReport> {
    return this.getAggregateReport(id)
      .flatMap((report) => {
        return report.rows.length === 0
          ? of({report: report, targets: []})
          : this.targetService.getTargetsForAssessment(report.rows[0].assessment.id)
            .pipe(
              map((targets) => <any>{report: report, targets: targets})
            );
      })
      .pipe(
        map(({report, targets}) => {
          const targetByClaimAndNaturalId: Map<string, Target> = targets.reduce((targetMap, target) => {
            targetMap.set(target.claimCode + "|" + target.naturalId, target);
            return targetMap;
          }, new Map<string, Target>());

          for (let row of report.rows) {
            const target: Target = targetByClaimAndNaturalId.get(row.claimCode  + "|" + row.targetNaturalId);
            if (target) {
              row.targetCode = target.code;
              row.targetDescription = target.description;
            }
          }
          return report;
        })
      );
  }

}
