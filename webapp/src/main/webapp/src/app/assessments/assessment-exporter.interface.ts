import { ExportItemsRequest } from './model/export-items-request.model';
import { ExportWritingTraitsRequest } from './model/export-writing-trait-request.model';

/**
 * Implementations of this interface are responsible for exporting CSVs
 */
export interface AssessmentExporter {
  exportItemsToCsv(request: ExportItemsRequest);
  exportWritingTraitScoresToCsv(request: ExportWritingTraitsRequest);
}
