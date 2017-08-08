import { Injectable } from "@angular/core";
import { ResponseContentType, Headers } from "@angular/http";
import { ReportOptions } from "./report-options.model";
import { Observable } from "rxjs";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../shared/enum/assessment-subject-type.enum";
import { DataService } from "../shared/data/data.service";
import { Download } from "../shared/data/download.model";
import { Report } from "./report.model";
import { ReportOrder } from "./report-order.enum";
import { ResponseUtils } from "../shared/response-utils";

@Injectable()
export class ReportService {

  constructor(private dataService: DataService) {
  }

  /**
   * Gets a list of all reports for the logged in user
   *
   * @returns {Observable<Report[]>}
   */
  public getReports(): Observable<Report[]> {
    return this.dataService.get('/reports')
      .catch(ResponseUtils.badResponseToNull)
      .map(reports => (reports || []).map(this.toReport));
  }

  /**
   * Gets a student exam report PDF download
   *
   * @param studentId the student ID
   * @param options settings which to shape the report content
   * @returns {Observable<Download>}
   */
  public getStudentExamReport(studentId: number, options: ReportOptions): Observable<Download> {
    return this.getExamReport(`/students/${studentId}/report`, options);
  }

  /**
   * Creates a group exam report PDF for download
   *
   * @param groupId the group ID
   * @param options settings which to shape the report content
   * @returns {Observable<Report>} the handle used the get status on the download
   */
  public createGroupExamReport(groupId: number, options: ReportOptions): Observable<Report> {
    return this.createBatchExamReport(`/groups/${groupId}/reports`, options);
  }

  /**
   * Creates a school/grade exam report PDF for download
   *
   * @param schoolId the school ID
   * @param gradeId the assessment grade ID
   * @param options settings which to shape the report content
   * @returns {Observable<Report>} the handle used the get status on the download
   */
  public createSchoolGradeExamReport(schoolId: number, gradeId: number, options: ReportOptions): Observable<Report> {
    return this.createBatchExamReport(`/schools/${schoolId}/assessmentGrades/${gradeId}/reports`, options);
  }

  /**
   * Gets an exam report download if ready, otherwise throws an exception
   *
   * @param reportId the handle used to lookup the download
   * @returns {Observable<Download>}
   */
  public getBatchExamReport(reportId: number): Observable<Download> {
    return this.getExamReport(`/reports/${reportId}`);
  }

  /**
   * Creates a batch exam report download
   *
   * @param url the endpoint to use to create the report
   * @param options settings which to shape the report content
   * @returns {Observable<Report>}
   */
  private createBatchExamReport(url: string, options: ReportOptions): Observable<Report> {
    return this.dataService
      .post(url, this.toBatchReportRequestParameters(options), {
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      .catch(ResponseUtils.badResponseToNull)
      .map(report => {
        if (report == null) {
          throw new Error('Error creating report');
        }
        return this.toReport(report);
      });
  }

  /**
   * Gets an exam report PDF and wraps it in a ReportDownload
   *
   * @param url the location of the exam report PDF download
   * @param options settings which to shape the report content
   * @returns {Observable<Download>}
   */
  private getExamReport(url: string, options?: ReportOptions): Observable<Download> {
    return this.dataService.get(url, {
      params: options != null ? this.toSingleReportRequestParameters(options) : null,
      headers: new Headers({
        'Accept': 'application/pdf',
      }),
      responseType: ResponseContentType.Blob
    }).catch(ResponseUtils.badResponseToNull);
  }

  /**
   * Gets the URL parameters for the given report options
   *
   * @param options the options to convert to url parameters
   * @returns {{assessmentType: any, subject: any, schoolYear: number, language: string, grayscale: boolean}}
   */
  private toSingleReportRequestParameters(options: ReportOptions): Object {
    return {
      assessmentType: AssessmentType[ options.assessmentType ],
      subject: AssessmentSubjectType[ options.subject ],
      schoolYear: options.schoolYear,
      language: options.language,
      grayscale: options.grayscale,
      name: options.name
    };
  }

  /**
   * Gets the URL parameters for the given report options
   *
   * @param options the options to convert to url parameters
   * @returns {{schoolYear: number, language: string, grayscale: boolean, order: any}}
   */
  private toBatchReportRequestParameters(options: ReportOptions): Object {
    return {
      schoolYear: options.schoolYear,
      language: options.language,
      order: ReportOrder[ options.order ],
      name: options.name
    };
  }

  /**
   * Maps a API report model to a local report model
   *
   * @param remote the API model
   * @returns {Report} the local model
   */
  private toReport(remote: any): Report {
    let local: Report = new Report();
    local.id = remote.id;
    local.label = remote.label;
    local.status = remote.status;
    local.created = remote.created;
    return local;
  }

}
