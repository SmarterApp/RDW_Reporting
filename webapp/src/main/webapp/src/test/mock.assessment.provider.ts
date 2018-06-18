import { Observable } from 'rxjs/Observable';
import { AssessmentItem } from '../app/assessments/model/assessment-item.model';
import { Exam } from '../app/assessments/model/exam.model';
import { Assessment } from '../app/assessments/model/assessment.model';
import { AssessmentProvider } from '../app/assessments/assessment-provider.interface';
import { of } from 'rxjs/observable/of';
import { TargetScoreExam } from '../app/assessments/model/target-score-exam.model';

export class MockAssessmentProvider implements AssessmentProvider {

  getAvailableAssessments(): Observable<Assessment[]> {
    return of([]);
  }

  getExams(assessmentId: number): Observable<Exam[]> {
    return of([]);
  }

  getAssessmentItems(assessmentId: number): Observable<AssessmentItem[]> {
    return of([]);
  }

  getTargetScoreExams(assessmentId: number): Observable<TargetScoreExam[]> {
    return of([]);
  }

  getSchoolId() {
    return null;
  }
}
