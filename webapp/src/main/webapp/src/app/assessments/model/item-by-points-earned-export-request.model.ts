import { AssessmentExam } from "./assessment-exam.model";
import { AssessmentItem } from "./assessment-item.model";
import { ItemPointField } from "./item-point-field.model";

/**
 * This model represents an Item by Points Earned table export request.
 */
export class ItemByPointsEarnedExportRequest {
  assessmentExam: AssessmentExam;
  assessmentItems: AssessmentItem[];
  pointColumns: ItemPointField[];
  showAsPercent: boolean;
}
