import { ExportRequest } from "../app/assessments/model/export-request.model";
import { Observable } from "rxjs/Observable";
import { AssessmentItem } from "../app/assessments/model/assessment-item.model";
import { Exam } from "../app/assessments/model/exam.model";
import { Assessment } from "../app/assessments/model/assessment.model";
import { AssessmentProvider } from "../app/assessments/assessment-provider.interface";

export class MockAssessmentProvider implements AssessmentProvider {
  getAvailableAssessments(): Observable<Assessment[]> {
    return Observable.of([]);
  }

  getExams(assessmentId: number): Observable<Exam[]> {
    return Observable.of([]);
  }

  getAssessmentItems(assessmentId: number): Observable<AssessmentItem[]> {
    return Observable.of([]);
  }

  exportItemsToCsv(exportRequest: ExportRequest) {
  }
}
