import { Injectable } from "@angular/core";
import { ResponseContentType, Headers } from "@angular/http";
import { ReportOptions } from "./report-options.model";
import { ReportDownloadToken } from "./report-download-token.model";
import { Observable } from "rxjs";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../shared/enum/assessment-subject-type.enum";
import { DataService } from "../shared/data/data.service";
import { Download } from "../shared/data/download.model";

@Injectable()
export class ReportDownloadService {

  constructor(private dataService: DataService) {
  }

  /**
   * Gets a student exam report PDF download
   *
   * @param studentId the student ID
   * @param options settings which to shape the report content
   * @returns {Observable<ReportDownload>}
   */
  public getStudentExamReport(studentId: number, options: ReportOptions): Observable<Download> {
    return this.getExamReport(`/students/${studentId}/examReport`, options);
  }

  /**
   * Creates a group exam report PDF for download
   *
   * @param groupId the group ID
   * @param options settings which to shape the report content
   * @returns {Observable<ReportDownloadToken>} the token used the get status on the download
   */
  public createGroupExamReport(groupId: number, options: ReportOptions): Observable<ReportDownloadToken> {
    return this.createBatchExamReport(`/groups/${groupId}/examReports`, options);
  }

  /**
   * Creates a school/grade exam report PDF for download
   *
   * @param schoolId the school ID
   * @param gradeId the assessment grade ID
   * @param options settings which to shape the report content
   * @returns {Observable<ReportDownloadToken>} the token used the get status on the download
   */
  public createSchoolGradeExamReport(schoolId: number, gradeId: number, options: ReportOptions): Observable<ReportDownloadToken> {
    return this.createBatchExamReport(`/schools/${schoolId}/assessmentGrades/${gradeId}/examReports`, options);
  }

  /**
   * Gets an exam report download if ready, otherwise throws an exception
   *
   * @param token the token used to lookup the download
   * @returns {Observable<ReportDownload>}
   */
  public getBatchExamReport(token: ReportDownloadToken): Observable<Download> {
    return this.getExamReport(`/examReports/${token.id}`);
  }

  /**
   * Creates a batch exam report download
   *
   * @param url the endpoint to use to create the report
   * @param options settings which to shape the report content
   * @returns {Observable<ReportDownloadToken>}
   */
  private createBatchExamReport(url: string, options: ReportOptions): Observable<ReportDownloadToken> {
    return this.dataService.post(url, { params: this.toParameters(options) })
      .map((token: any) => new ReportDownloadToken(token.id));
  }

  /**
   * Gets an exam report PDF and wraps it in a ReportDownload
   *
   * @param url the location of the exam report PDF download
   * @param options settings which to shape the report content
   * @returns {Observable<ReportDownload>}
   */
  private getExamReport(url: string, options?: ReportOptions): Observable<Download> {
    return this.dataService.get(url, {
      params: options != null ? this.toParameters(options) : null,
      headers: new Headers({
        Accept: 'application/pdf'
      }),
      responseType: ResponseContentType.Blob
    });
  }

  /**
   * Gets the URL parameters for the given report options
   *
   * @param options the options to convert to url parameters
   * @returns {{assessmentType: any, subject: any, schoolYear: number, language: string, grayscale: boolean}}
   */
  private toParameters(options: ReportOptions): Object {
    return {
      assessmentType: AssessmentType[ options.assessmentType ],
      subject: AssessmentSubjectType[ options.subject ],
      schoolYear: options.schoolYear,
      language: options.language,
      grayscale: options.grayscale
    };
  }

}
