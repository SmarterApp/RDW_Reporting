import { AssessmentExam } from "./assessment-exam.model";
import { AssessmentItem } from "./assessment-item.model";
import { ItemByPointsEarnedColumn } from "./Item-by-points-earned-column.model";

/**
 * This model represents an Item by Points Earned table export request.
 */
export class ItemByPointsEarnedExport {
  assessmentExam: AssessmentExam;
  assessmentItems: AssessmentItem[];
  pointColumns: ItemByPointsEarnedColumn[];
  showAsPercent: boolean;
}
