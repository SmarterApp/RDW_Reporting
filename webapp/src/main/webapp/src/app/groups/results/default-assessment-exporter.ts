import { AssessmentExporter } from '../../assessments/assessment-exporter.interface';
import { GroupAssessmentExportService } from './group-assessment-export.service';
import { ExportItemsRequest } from '../../assessments/model/export-items-request.model';
import { ExportWritingTraitsRequest } from '../../assessments/model/export-writing-trait-request.model';
import { ExportTargetReportRequest } from '../../assessments/model/export-target-report-request.model';

export class DefaultAssessmentExporter implements AssessmentExporter {

  constructor(private service: GroupAssessmentExportService,
              private groupName: string,
              private groupSchoolYear: number,
              private filenameProvider: (request: ExportItemsRequest | ExportWritingTraitsRequest | ExportTargetReportRequest) => string) {
  }

  name = this.groupName;
  schoolYear = this.groupSchoolYear;

  exportItemsToCsv(request: ExportItemsRequest) {
    this.service.exportItemsToCsv(request, this.filenameProvider(request));
  }

  exportWritingTraitScoresToCsv(request: ExportWritingTraitsRequest) {
    this.service.exportWritingTraitScoresToCsv(request, this.filenameProvider(request));
  }

  exportTargetScoresToCsv(request: ExportTargetReportRequest) {
    this.service.exportTargetScoresToCsv(request, this.name, this.schoolYear, this.filenameProvider(request));
  }

}
