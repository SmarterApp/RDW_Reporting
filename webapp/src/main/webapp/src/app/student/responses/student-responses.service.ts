import { Injectable } from "@angular/core";
import { AssessmentExamMapper } from "../../assessments/assessment-exam.mapper";
import { DataService } from "@sbac/rdw-reporting-common-ngx";
import { Observable } from "rxjs/Observable";
import { AssessmentItem } from "../../assessments/model/assessment-item.model";
import { ResponseUtils } from "../../shared/response-utils";

/**
 * This service is responsible for providing student response information.
 */
@Injectable()
export class StudentResponsesService {

  constructor(
    private dataService: DataService,
    private assessmentMapper: AssessmentExamMapper) {}

  /**
   * Retrieve the exam responses for a given exam.
   *
   * @param studentId The student database id
   * @param examId    The exam database id
   * @returns {Observable<AssessmentItem[]>} The exam responses
   */
  findItemsByStudentAndExam(studentId: number, examId: number): Observable<AssessmentItem[]> {
    return this.dataService.get(`/students/${studentId}/exams/${examId}/examitems`)
      .catch(ResponseUtils.badResponseToNull)
      .map((apiExamItems) => {
        if (!apiExamItems) return null;

       return this.assessmentMapper.mapAssessmentItemsFromApi(apiExamItems);
      });
  }
}
