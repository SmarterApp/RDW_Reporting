import { Observable } from "rxjs/Observable";
import { AssessmentItem } from "../app/assessments/model/assessment-item.model";
import { Exam } from "../app/assessments/model/exam.model";
import { Assessment } from "../app/assessments/model/assessment.model";
import { AssessmentProvider } from "../app/assessments/assessment-provider.interface";
import { of } from 'rxjs/observable/of';

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

  getSchoolId() {
    return null;
  }
}
