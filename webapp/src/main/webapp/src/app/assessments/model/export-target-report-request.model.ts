import { Assessment } from "./assessment.model";
import { RequestType } from "../../shared/enum/request-type.enum";
import { ExportRequest } from "./export-request.interface";
import { AggregateTargetScoreRow } from './aggregate-target-score-row.model';

/**
 * This model represents a Target Report aggregate table export request.
 */
export class ExportTargetReportRequest implements ExportRequest {
  assessment: Assessment;
  group: string;
  schoolYear: number;
  averageScaleScore: number;
  standardError: number;

  targetScoreRows: AggregateTargetScoreRow[];
  type: RequestType = RequestType.WritingTraitScores;
}
