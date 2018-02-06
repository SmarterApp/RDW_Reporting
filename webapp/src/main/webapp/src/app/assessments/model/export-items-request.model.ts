import { AssessmentItem } from "./assessment-item.model";
import { DynamicItemField } from "./item-point-field.model";
import { Assessment } from "./assessment.model";
import { RequestType } from "../../shared/enum/request-type.enum";
import { ExportRequest } from "./export-request.interface";

/**
 * This model represents an Item by Points Earned or Distractor Analysis table export request.
 */
export class ExportItemsRequest implements ExportRequest {
  assessment: Assessment;
  assessmentItems: AssessmentItem[];
  pointColumns: DynamicItemField[];
  showAsPercent: boolean;
  type: RequestType;
}
