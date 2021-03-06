import { Observable } from 'rxjs';
import { Assessment } from './model/assessment';
import { Exam } from './model/exam';
import { AssessmentItem } from './model/assessment-item.model';
import { TargetScoreExam } from './model/target-score-exam.model';

/**
 * Implementations of this interface are responsible for providing context-based assessment and exam data.
 */
export interface AssessmentProvider {
  getAvailableAssessments(): Observable<Assessment[]>;
  getExams(assessmentId: number): Observable<Exam[]>;
  getAssessmentItems(
    assessmentId: number,
    itemTypes?: string[]
  ): Observable<AssessmentItem[]>;
  getTargetScoreExams(assessmentId: number): Observable<TargetScoreExam[]>;
  getSchoolId(): number;
}
