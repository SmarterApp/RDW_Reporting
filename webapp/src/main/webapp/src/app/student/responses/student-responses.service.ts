import { Injectable } from '@angular/core';
import { AssessmentExamMapper } from '../../assessments/assessment-exam.mapper';
import { Observable } from 'rxjs';
import { AssessmentItem } from '../../assessments/model/assessment-item.model';
import { ResponseUtils } from '../../shared/response-utils';
import { DataService } from '../../shared/data/data.service';
import { catchError, map } from 'rxjs/operators';
import { ReportingServiceRoute } from '../../shared/service-route';

const ServiceRoute = ReportingServiceRoute;

/**
 * This service is responsible for providing student response information.
 */
@Injectable()
export class StudentResponsesService {
  constructor(
    private dataService: DataService,
    private assessmentMapper: AssessmentExamMapper
  ) {}

  /**
   * Retrieve the exam responses for a given exam.
   *
   * @param studentId The student database id
   * @param examId    The exam database id
   * @returns {Observable<AssessmentItem[]>} The exam responses
   */
  findItemsByStudentAndExam(
    studentId: number,
    examId: number
  ): Observable<AssessmentItem[]> {
    return this.dataService
      .get(`${ServiceRoute}/students/${studentId}/exams/${examId}/examitems`)
      .pipe(
        catchError(ResponseUtils.badResponseToNull),
        map(apiExamItems => {
          if (!apiExamItems) return null;

          return this.assessmentMapper.mapAssessmentItemsFromApi(apiExamItems);
        })
      );
  }
}
