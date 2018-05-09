import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { StudentExamHistory } from "./model/student-exam-history.model";
import { Student } from "./model/student.model";
import { AssessmentExamMapper } from "../assessments/assessment-exam.mapper";
import { StudentHistoryExamWrapper } from "./model/student-history-exam-wrapper.model";
import { ResponseUtils } from "../shared/response-utils";
import { DataService } from "../shared/data/data.service";
import { catchError, map } from 'rxjs/operators';
import { ReportingServiceRoute } from '../shared/service-route';

const ServiceRoute = ReportingServiceRoute;

@Injectable()
export class StudentExamHistoryService {

  constructor(private dataService: DataService,
              private assessmentMapper: AssessmentExamMapper) {
  }

  /**
   * Retrieve the exam history for a student by id.
   *
   * @param id The student database id
   * @returns {Observable<StudentExamHistory>} The student's exam history
   */
  findOneById(id: number): Observable<StudentExamHistory> {
    return this.dataService.get(`${ServiceRoute}/students/${id}/exams`)
      .pipe(
        catchError(ResponseUtils.badResponseToNull),
        map(serverExamHistory => {
          if (serverExamHistory == null) {
            return null;
          }
          const history: StudentExamHistory = new StudentExamHistory();
          history.student = this.assessmentMapper.mapStudentFromApi(serverExamHistory.student);
          history.exams = this.mapExamWrappers(serverExamHistory.exams);
          return history;
        })
      );
  }

  /**
   * Determine if a student with the given SSID exists and has accessible exams.
   *
   * @param ssid  State-issued student identifier
   * @returns {Observable<boolean>} True if the student exists
   */
  existsBySsid(ssid: string): Observable<Student> {
    return this.dataService.get(`${ServiceRoute}/students/${ssid.trim()}`).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverStudent => {
        if (serverStudent == null) {
          return null;
        }
        return this.assessmentMapper.mapStudentFromApi(serverStudent);
      })
    );
  }

  private mapExamWrappers(serverExamWrappers: any): StudentHistoryExamWrapper[] {
    return (serverExamWrappers || [])
      .sort((a, b) => new Date(a.exam.dateTime) > new Date(b.exam.dateTime) ? -1 : 1)
      .map(serverExamWrapper => this.mapExamWrapper(serverExamWrapper));
  }

  private mapExamWrapper(serverExamWrapper: any): StudentHistoryExamWrapper {
    const wrapper: StudentHistoryExamWrapper = new StudentHistoryExamWrapper();
    wrapper.assessment = this.assessmentMapper.mapAssessmentFromApi(serverExamWrapper.assessment);
    wrapper.exam = this.assessmentMapper.mapExamFromApi(serverExamWrapper.exam);
    return wrapper;
  }

}
