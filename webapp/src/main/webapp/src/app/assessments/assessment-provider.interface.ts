import { Observable } from "rxjs";
import { Assessment } from "./model/assessment.model";
import { Exam } from "./model/exam.model";
import { AssessmentItem } from "./model/assessment-item.model";
import { ItemByPointsEarnedExportRequest } from "./model/item-by-points-earned-export-request.model";

/**
 * Implementations of this interface are responsible for providing context-based assessment and exam data.
 */
export interface AssessmentProvider{
  getAvailableAssessments(): Observable<Assessment[]>;
  getExams(assessmentId: number): Observable<Exam[]>;
  getAssessmentItems(assessmentId: number): Observable<AssessmentItem[]>;

  // TODO: Technically not a provider method, but if we add one more export, let's break
  // TODO: this out to an AssessmentExporter interface.
  exportItemsToCsv(exportRequest: ItemByPointsEarnedExportRequest)
}
