import { ExportItemsRequest } from "../app/assessments/model/export-items-request.model";
import { ExportWritingTraitsRequest } from "../app/assessments/model/export-writing-trait-request.model";
import { AssessmentExporter } from "../app/assessments/assessment-exporter.interface";
import { ExportTargetReportRequest } from '../app/assessments/model/export-target-report-request.model';

export class MockAssessmentExporter implements AssessmentExporter {
  exportItemsToCsv(exportRequest: ExportItemsRequest) {
  }

  exportWritingTraitScoresToCsv(exportRequest: ExportWritingTraitsRequest) {
  }

  exportTargetScoresToCsv(request: ExportTargetReportRequest) {
  }
}
