import { Injectable } from '@angular/core';
import { DataService } from '../shared/data/data.service';
import { Observable, of } from 'rxjs';
import { AggregateServiceRoute } from '../shared/service-route';
import { AggregateReportRow } from '../report/aggregate-report';
import { AssessmentService } from './assessment/assessment.service';
import { map, flatMap } from 'rxjs/operators';
import { Assessment } from './assessment/assessment';
import { AssessmentDefinition } from './assessment/assessment-definition';
import { UserReportService } from '../report/user-report.service';
import {
  AggregateReportQueryType,
  ReportQueryType,
  UserReport
} from '../report/report';

export interface BasicReport {
  readonly rows: AggregateReportRow[];
}

export interface LongitudinalReport extends BasicReport {
  readonly assessments: Assessment[];
}

const DefaultReportType: ReportQueryType = 'CustomAggregate';

/**
 * Responsible for interfacing with aggregate report server
 */
@Injectable()
export class AggregateReportService {
  constructor(
    private dataService: DataService,
    private reportService: UserReportService,
    private assessmentService: AssessmentService
  ) {}

  /**
   * Gets the estimated report row count for the provided report request
   *
   * @param query the report parameters
   */
  getEstimatedRowCount(query: AggregateReportQueryType): Observable<number> {
    return this.dataService.post(
      `${AggregateServiceRoute}/aggregate/estimatedRowCount`,
      query
    );
  }

  /**
   * Gets the effective report type
   *
   * @param {ReportQueryType} reportType the report type
   * @param {AssessmentDefinition} definition the assessment definition
   * @returns {ReportQueryType}
   */
  getEffectiveReportType(
    reportType: ReportQueryType,
    definition: AssessmentDefinition
  ): ReportQueryType {
    return definition.aggregateReportTypes.includes(reportType)
      ? reportType
      : DefaultReportType;
  }

  /**
   * Creates an aggregate report
   *
   * @param {AggregateReportQueryType} request the report parameters
   * @returns {Observable<Report>} the report resource handle
   */
  createReport(request: AggregateReportQueryType): Observable<UserReport> {
    return this.reportService.createReport(request);
  }

  /**
   * Gets a single aggregate report by ID
   *
   * @param {number} id the report ID
   * @returns {Observable<Report>} the report resource handle
   */
  getReportById(id: number): Observable<UserReport> {
    return this.reportService.getReport(id);
  }

  getAggregateReport(id: number): Observable<BasicReport> {
    return this.reportService
      .getReportContent(id)
      .pipe(map(rows => <BasicReport>{ rows }));
  }

  downloadReportContent(id: number): void {
    return this.reportService.openReport(id);
  }

  // TODO move mapping layer
  getLongitudinalReport(id: number): Observable<LongitudinalReport> {
    return this.getAggregateReport(id).pipe(
      flatMap(({ rows }) => {
        return this.assessmentService
          .getAssessments({
            ids: rows.reduce((ids, row: AggregateReportRow) => {
              if (ids.indexOf(row.assessment.id) === -1) {
                ids.push(row.assessment.id);
              }
              return ids;
            }, [])
          })
          .pipe(map(assessments => <LongitudinalReport>{ rows, assessments }));
      })
    );
  }
}
