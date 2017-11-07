import { Injectable } from "@angular/core";
import { Headers, ResponseContentType } from "@angular/http";
import { ReportOptions } from "./report-options.model";
import { Observable } from "rxjs";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../shared/enum/assessment-subject-type.enum";
import { DataService } from "@sbac/rdw-reporting-common-ngx";
import { Download } from "@sbac/rdw-reporting-common-ngx";
import { Report } from "./report.model";
import { ReportOrder } from "./report-order.enum";
import { ResponseUtils } from "../shared/response-utils";
import { Student } from "../student/model/student.model";
import { Group } from "../user/model/group.model";
import { School } from "../user/model/school.model";
import { Grade } from "../school-grade/grade.model";

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
      .map(reports => reports.map(this.toReport))
      .catch(ResponseUtils.throwError);
  }

  /**
   * Gets a list of all reports for the logged in user
   *
   * @returns {Observable<Report[]>}
   */
  public getReportsById(ids: number[]): Observable<Report[]> {
    return this.dataService.get(`/reports`, {params: {id: ids}})
      .map(reports => reports.map(this.toReport))
      .catch(ResponseUtils.throwError);
  }

  /**
   * Creates an individual student exam report PDF for download
   *
   * @param student the student
   * @param options settings which to shape the report content
   * @returns {Observable<Report>} the handle used the get status on the download
   */
  public createStudentExamReport(student: Student, options: ReportOptions): Observable<Report> {
    return this.createExamReport(`/students/${student.id}/report`, options);
  }

  /**
   * Creates a group exam report PDF for download
   *
   * @param group the group
   * @param options settings which to shape the report content
   * @returns {Observable<Report>} the handle used the get status on the download
   */
  public createGroupExamReport(group: Group, options: ReportOptions): Observable<Report> {
    return this.createExamReport(`/groups/${group.id}/reports`, options);
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
    return this.createExamReport(`/schools/${school.id}/assessmentGrades/${grade.id}/reports`, options);
  }

  /**
   * Gets an exam report download if ready, otherwise throws an exception
   *
   * @param reportId the handle used to lookup the download
   * @returns {Observable<Download>}
   */
  public getExamReport(reportId: number): Observable<Download> {
    return this.dataService.get(`/reports/${reportId}`, {
      headers: new Headers({
        'Accept': 'application/pdf',
      }),
      responseType: ResponseContentType.Blob
    }).catch(ResponseUtils.throwError);
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
      })
      .map(this.toReport)
      .catch(ResponseUtils.throwError);
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
      assessmentType: AssessmentType[ options.assessmentType ],
      subject: AssessmentSubjectType[ options.subject ],
      schoolYear: options.schoolYear,
      language: options.language,
      grayscale: options.grayscale,
      accommodationsVisible: options.accommodationsVisible,
      order: ReportOrder[ options.order ]
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
    local.reportType = remote.reportType;
    local.assessmentType = AssessmentType[ remote.assessmentType as string ];
    local.subjectId = AssessmentSubjectType[ remote.subject as string ] || 0;
    local.schoolYear = remote.schoolYear;
    return local;
  }

}
