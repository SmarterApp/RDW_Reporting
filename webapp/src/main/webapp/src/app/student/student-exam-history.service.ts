import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { URLSearchParams } from "@angular/http";
import { DataService } from "../shared/data/data.service";
import { StudentExamHistory } from "./model/student-exam-history.model";
import { Student } from "./model/student.model";
import { Assessment } from "../assessments/model/assessment.model";
import { AssessmentExamMapper } from "../assessments/assessment-exam.mapper";
import { Exam } from "../assessments/model/exam.model";
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

        let student: Student = this.mapStudent(apiExamHistory.student);
        let examWrappers: StudentHistoryExamWrapper[] = this.mapExamWrappers(apiExamHistory.exams);
        return new StudentExamHistory(student, examWrappers);
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
      .catch(() => {
        return Observable.of(false);
      })
      .map((apiStudent) => {
        if (!apiStudent) return null;

        return this.mapStudent(apiStudent);
      });
  }

  private mapStudent(apiStudent: any): Student {
    return new Student(
      apiStudent.id,
      apiStudent.ssid,
      apiStudent.firstName,
      apiStudent.lastName);
  }

  private mapExamWrappers(apiExamWrappers: any): StudentHistoryExamWrapper[] {
    if (!apiExamWrappers) return [];

    return apiExamWrappers.map((apiWrapper) => this.mapExamWrapper(apiWrapper));
  }

  private mapExamWrapper(apiExamWrapper: any): StudentHistoryExamWrapper {
    let assessment: Assessment = this.assessmentMapper.mapAssessmentFromApi(apiExamWrapper.assessment);
    let exam: Exam = this.assessmentMapper.mapExamFromApi(apiExamWrapper.exam);

    let apiSchool: any = apiExamWrapper.school;
    let school: School = new School();
    school.id = apiSchool.id;
    school.name = apiSchool.name;

    return new StudentHistoryExamWrapper(assessment, exam, school);
  }
}
