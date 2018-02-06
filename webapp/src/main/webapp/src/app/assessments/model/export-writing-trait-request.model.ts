import { AssessmentItem } from "./assessment-item.model";
import { Assessment } from "./assessment.model";
import { RequestType } from "../../shared/enum/request-type.enum";
import { WritingTraitScoreSummary } from "./writing-trait-score-summary.model";
import { ExportRequest } from "./export-request.interface";

/**
 * This model represents a Writing Trait Score aggregate table export request.
 */
export class ExportWritingTraitsRequest implements ExportRequest {
  assessment: Assessment;
  assessmentItems: AssessmentItem[];
  summaries: WritingTraitScoreSummary[];
  showAsPercent: boolean;
  type: RequestType = RequestType.WritingTraitScores;
}
