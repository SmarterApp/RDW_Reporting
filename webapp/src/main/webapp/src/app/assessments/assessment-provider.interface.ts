import { Observable } from 'rxjs/Observable';
import { Assessment } from './model/assessment.model';
import { Exam } from './model/exam.model';
import { AssessmentItem } from './model/assessment-item.model';
import { TargetScoreExam } from './model/target-score-exam.model';
import { AssessmentExam } from './model/assessment-exam.model';

/**
 * Implementations of this interface are responsible for providing context-based assessment and exam data.
 */
export interface AssessmentProvider {

  getMostRecentAssessment(orgId?: number, gradeId?: number, schoolYear?: number): Observable<AssessmentExam>;
  getAvailableAssessments(): Observable<Assessment[]>;
  getExams(assessmentId: number): Observable<Exam[]>;
  getAssessmentItems(assessmentId: number, itemTypes?: string[]): Observable<AssessmentItem[]>;
  getTargetScoreExams(assessmentId: number): Observable<TargetScoreExam[]>;
  getSchoolId(): number;
}
