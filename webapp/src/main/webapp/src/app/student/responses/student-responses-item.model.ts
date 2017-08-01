import { AssessmentItem } from "../../assessments/model/assessment-item.model";

/**
 * This model wrapper class contains both an AssessmentItem and
 * calculated correctness value.
 */
export class StudentResponsesAssessmentItem {
  assessmentItem: AssessmentItem;
  score: number;
  correctness: number;
  response: string;
}
