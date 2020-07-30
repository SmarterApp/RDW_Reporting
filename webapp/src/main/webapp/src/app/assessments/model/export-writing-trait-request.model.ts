import { AssessmentItem } from './assessment-item.model';
import { TraitScoreSummary } from './trait-score-summary.model';
import { ExportRequest } from './export-request.interface';

/**
 * This model represents a Writing Trait Score aggregate table export request.
 */
export interface ExportWritingTraitsRequest extends ExportRequest {
  assessmentItems: AssessmentItem[];
  summaries: Map<String, TraitScoreSummary>[];
  showAsPercent: boolean;
}
