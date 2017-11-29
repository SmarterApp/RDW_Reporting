import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { URLSearchParams } from "@angular/http";
import { DataService } from "@sbac/rdw-reporting-common-ngx";
import { StudentExamHistory } from "./model/student-exam-history.model";
import { Student } from "./model/student.model";
import { AssessmentExamMapper } from "../assessments/assessment-exam.mapper";
import { StudentHistoryExamWrapper } from "./model/student-history-exam-wrapper.model";
import { ResponseUtils } from "../shared/response-utils";

@Injectable()
export class StudentExamHistoryService {

  constructor(
    private dataService: DataService,
    private assessmentMapper: AssessmentExamMapper) {}

  /**
   * Retrieve the exam history for a student by id.
   *
   * @param id The student database id
   * @returns {Observable<StudentExamHistory>} The student's exam history
   */
  findOneById(id: number): Observable<StudentExamHistory> {
    return this.dataService.get(`/students/${id}/exams`)
      .catch(ResponseUtils.badResponseToNull)
      .map((apiExamHistory) => {
        if (apiExamHistory == null) return null;

        let uiModel: StudentExamHistory = new StudentExamHistory();
        uiModel.student = this.assessmentMapper.mapStudentFromApi(apiExamHistory.student);
        uiModel.exams = this.mapExamWrappers(apiExamHistory.exams);

        return uiModel;
      });
  }

  /**
   * Determine if a student with the given SSID exists and has accessible exams.
   *
   * @param ssid  State-issued student identifier
   * @returns {Observable<boolean>} True if the student exists
   */
  existsBySsid(ssid: string): Observable<Student> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('hasExams', 'true');
    let trimmedSsid: string = ssid.trim();

    return this.dataService.get(`/students/${trimmedSsid}`, {params: params})
      .catch(ResponseUtils.badResponseToNull)
      .map((apiStudent) => {
        if (apiStudent == null) return null;

        return this.assessmentMapper.mapStudentFromApi(apiStudent);
      });
  }

  private mapExamWrappers(apiExamWrappers: any): StudentHistoryExamWrapper[] {
    if (!apiExamWrappers) return [];

    return apiExamWrappers.map((apiWrapper) => this.mapExamWrapper(apiWrapper));
  }

  private mapExamWrapper(apiExamWrapper: any): StudentHistoryExamWrapper {
    let uiModel: StudentHistoryExamWrapper = new StudentHistoryExamWrapper();
    uiModel.assessment = this.assessmentMapper.mapAssessmentFromApi(apiExamWrapper.assessment);
    uiModel.exam = this.assessmentMapper.mapExamFromApi(apiExamWrapper.exam);

    return uiModel;
  }
}
