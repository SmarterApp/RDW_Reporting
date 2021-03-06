import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Assessment } from '../../assessments/model/assessment';
import { StudentExamHistory } from '../model/student-exam-history.model';
import { StudentHistoryExamWrapper } from '../model/student-history-exam-wrapper.model';

/**
 * This resolver is responsible for fetching the responses assessment from the parent route's data.
 */
@Injectable()
export class StudentHistoryResponsesAssessmentResolve
  implements Resolve<Assessment> {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Assessment {
    let examId: number = route.params['examId'];
    let history: StudentExamHistory = route.parent.data['examHistory'];
    if (!history) {
      return null;
    }

    let wrappers: StudentHistoryExamWrapper[] = history.exams;
    let wrapper: StudentHistoryExamWrapper = wrappers.find(
      wrapper => wrapper.exam.id == examId
    );
    if (!wrapper) {
      return null;
    }

    return wrapper.assessment;
  }
}
