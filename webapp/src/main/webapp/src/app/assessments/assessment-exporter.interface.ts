import { ExportItemsRequest } from './model/export-items-request.model';
import { ExportWritingTraitsRequest } from './model/export-writing-trait-request.model';
import { ExportTargetReportRequest } from './model/export-target-report-request.model';

/**
 * Implementations of this interface are responsible for exporting CSVs
 */
export interface AssessmentExporter {
  exportItemsToCsv(request: ExportItemsRequest);
  exportWritingTraitScoresToCsv(request: ExportWritingTraitsRequest);
  exportTargetScoresToCsv(request: ExportTargetReportRequest);
}
