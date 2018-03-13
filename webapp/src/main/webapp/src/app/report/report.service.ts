import { Inject, Injectable } from "@angular/core";
import { Headers, ResponseContentType } from "@angular/http";
import { ReportOptions } from "./report-options.model";
import { Observable } from "rxjs/Observable";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../shared/enum/assessment-subject-type.enum";
import { Report } from "./report.model";
import { ReportOrder } from "./report-order.enum";
import { ResponseUtils } from "../shared/response-utils";
import { Student } from "../student/model/student.model";
import { Group } from "../groups/group";
import { School } from "../school-grade/school";
import { Grade } from "../school-grade/grade.model";
import { DATA_CONTEXT_URL, DataService } from "../shared/data/data.service";
import { Download } from "../shared/data/download.model";
import { AggregateReportRequest } from "./aggregate-report-request";
import { AggregateReportRow } from "./aggregate-report";
import { Utils } from "../shared/support/support";
import { catchError, map } from 'rxjs/operators';
import { ReportProcessorServiceRoute } from '../shared/service-route';

const ServiceRoute = ReportProcessorServiceRoute;

@Injectable()
export class ReportService {

  constructor(private dataService: DataService,
              @Inject(DATA_CONTEXT_URL) private contextUrl: string = '/api') {
  }

  /**
   * Gets a list of all reports for the logged in user
   *
   * @returns {Observable<Report[]>}
   */
  public getReports(): Observable<Report[]> {
    return this.dataService.get(`${ServiceRoute}/reports`)
      .pipe(
        map(reports => reports.map(this.toReport)),
        catchError(ResponseUtils.throwError)
      );
  }

  /**
   * Gets a single report by its entity ID
   *
   * @returns {Observable<Report[]>}
   */
  public getReportById(id: number): Observable<Report> {
    return this.getReportsById([ id ])
      .pipe(
        map(reports => reports[ 0 ])
      );
  }

  /**
   * Gets a list of all reports for the logged in user
   *
   * @returns {Observable<Report[]>}
   */
  public getReportsById(ids: number[]): Observable<Report[]> {
    return this.dataService.get(`${ServiceRoute}/reports`, { params: { id: ids } })
      .pipe(
        map(reports => reports.map(this.toReport)),
        catchError(ResponseUtils.throwError)
      );
  }

  /**
   * Creates an individual student exam report PDF for download
   *
   * @param student the student
   * @param options settings which to shape the report content
   * @returns {Observable<Report>} the handle used the get status on the download
   */
  public createStudentExamReport(student: Student, options: ReportOptions): Observable<Report> {
    return this.createExamReport(`${ServiceRoute}/students/${student.id}/report`, options);
  }

  /**
   * Creates a group exam report PDF for download
   *
   * @param group the group
   * @param options settings which to shape the report content
   * @returns {Observable<Report>} the handle used the get status on the download
   */
  public createGroupExamReport(group: Group, options: ReportOptions): Observable<Report> {
    return this.createExamReport(`${ServiceRoute}/groups/${group.id}/reports`, options);
  }

  /**
   * Creates a school/grade exam report PDF for download
   *
   * @param school the school
   * @param grade the assessment grade
   * @param options settings which to shape the report content
   * @returns {Observable<Report>} the handle used the get status on the download
   */
  public createSchoolGradeExamReport(school: School, grade: Grade, options: ReportOptions): Observable<Report> {
    return this.createExamReport(`${ServiceRoute}/schools/${school.id}/assessmentGrades/${grade.id}/reports`, options);
  }

  /**
   * Creates an aggregate report
   *
   * @param request the parameters to create the report with
   * @returns {Observable<Report>} the handle used the get status on the download
   */
  public createAggregateReport(request: AggregateReportRequest): Observable<Report> {
    return this.dataService.post(`${ServiceRoute}/aggregate`, request, {
      headers: new Headers({ 'Content-Type': 'application/json' })
    }).pipe(
      map(this.toReport),
      catchError(ResponseUtils.throwError)
    );
  }

  /**
   * Gets an exam report download if ready, otherwise throws an exception
   *
   * @param reportId the handle used to lookup the download
   * @returns {Observable<Download>}
   */
  public getReportContent(reportId: number): Observable<Download> {
    return this.dataService.get(`${ServiceRoute}/reports/${reportId}`, {
      headers: new Headers({
        'Accept': '*/*'
      }),
      responseType: ResponseContentType.Blob
    }).pipe(
  catchError(ResponseUtils.throwError)
    );
  }

  /**
   * Download the given report by opening a tab to the report content.
   *
   * @param {number} reportId The report id
   */
  public downloadReportContent(reportId: number): void {
    window.open(`${this.contextUrl}${ServiceRoute}/reports/${reportId}`, '_blank');
  }

  /**
   * Gets an aggregate report download if ready, otherwise throws an exception
   *
   * @param reportId the handle used to lookup the download
   * @returns {Observable<Download>}
   */
  public getAggregateReport(reportId: number): Observable<AggregateReportRow[]> {
    return this.dataService.get(`${ServiceRoute}/reports/${reportId}`, {
      headers: new Headers({
        'Accept': 'application/json'
      })
    }).pipe(
      catchError(ResponseUtils.throwError)
    );
  }

  /**
   * Creates a batch exam report download
   *
   * @param url the endpoint to use to create the report
   * @param options settings which to shape the report content
   * @returns {Observable<Report>}
   */
  private createExamReport(url: string, options: ReportOptions): Observable<Report> {
    return this.dataService
      .post(url, this.toReportRequestParameters(options), {
        headers: new Headers({ 'Content-Type': 'application/json' })
      }).pipe(
        map(this.toReport),
        catchError(ResponseUtils.throwError)
      );
  }

  /**
   * Gets the URL parameters for the given report options
   *
   * @param options the options to convert to url parameters
   * @returns {{schoolYear: number, language: string, grayscale: boolean, order: any}}
   */
  private toReportRequestParameters(options: ReportOptions): Object {
    return {
      name: options.name,
      assessmentType: Utils.toServerAssessmentTypeEnum(options.assessmentType),
      subject: Utils.toServerSubjectEnum(options.subject),
      schoolYear: options.schoolYear,
      language: options.language,
      grayscale: options.grayscale,
      accommodationsVisible: options.accommodationsVisible,
      order: ReportOrder[ options.order ],
      disableTransferAccess: options.disableTransferAccess
    };
  }

  /**
   * Maps a API report model to a local report model
   *
   * @param serverReport the API model
   * @returns {Report} the local model
   */
  private toReport(serverReport: any): Report {
    const report: Report = new Report();
    report.id = serverReport.id;
    report.label = serverReport.label;
    report.status = serverReport.status;
    report.created = serverReport.created;
    report.reportType = serverReport.reportType;
    report.assessmentType = AssessmentType[ serverReport.assessmentType as string ];

    // HOTFIX for aggreagte report assessment type display
    // unable to use ExamReportAssessmentType enum because it does not support summatives
    if (serverReport.reportType === 'AggregateReportRequest') {
      report.assessmentTypeCode = (<AggregateReportRequest>serverReport.request).reportQuery.assessmentTypeCode;
    } else {
      report.assessmentTypeCode = serverReport.assessmentTypeCode;
    }

    report.subjectId = AssessmentSubjectType[ serverReport.subject as string ] || 0;
    report.subjectCode = serverReport.subjectCode;
    report.schoolYear = serverReport.schoolYear;
    report.metadata = serverReport.metadata || {};
    report.request = serverReport.request;
    return report;
  }

}
