import { RequestType } from "../../shared/enum/request-type.enum";
import { Assessment } from "./assessment.model";

export interface ExportRequest {
  assessment: Assessment;
  type: RequestType;
}
