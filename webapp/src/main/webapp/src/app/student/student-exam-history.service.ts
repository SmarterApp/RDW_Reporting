import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { URLSearchParams } from "@angular/http";
import { DataService } from "../shared/data/data.service";
import { StudentExamHistory } from "./model/student-exam-history.model";
import { Student } from "./model/student.model";
import { AssessmentExamMapper } from "../assessments/assessment-exam.mapper";
import { StudentHistoryExamWrapper } from "./model/student-history-exam-wrapper.model";
import { School } from "../user/model/school.model";

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
      .map((apiExamHistory) => {
        if (!apiExamHistory) return null;

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

    return this.dataService.get(`/students/${ssid}`, {params: params})
      .catch((response) => {
        if (response.status == 404) {
          return Observable.of(false);
        } else {
          return Observable.throw(response);
        }
      })
      .map((apiStudent) => {
        if (!apiStudent) return null;

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

    let apiSchool: any = apiExamWrapper.school;
    let school: School = new School();
    school.id = apiSchool.id;
    school.name = apiSchool.name;
    uiModel.school = school;

    return uiModel;
  }
}
