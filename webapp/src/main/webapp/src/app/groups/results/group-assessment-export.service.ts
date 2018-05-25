import {Injectable} from "@angular/core";
import {AssessmentExporter} from "../../assessments/assessment-exporter.interface";
import {ExportItemsRequest} from "../../assessments/model/export-items-request.model";
import {ExportWritingTraitsRequest} from "../../assessments/model/export-writing-trait-request.model";
import {ExportRequest} from "../../assessments/model/export-request.interface";
import {Assessment} from "../../assessments/model/assessment.model";
import {Angulartics2} from "angulartics2";
import {CsvExportService} from "../../csv-export/csv-export.service";
import {TranslateService} from "@ngx-translate/core";
import {Group} from "../../groups/group";

@Injectable()
export class GroupAssessmentExportService implements AssessmentExporter {

  group: Group;

  constructor(private csvExportService: CsvExportService,
              private angulartics2: Angulartics2,
              private translate: TranslateService) {
  }

  exportItemsToCsv(exportRequest: ExportItemsRequest) {
    let filename: string = this.getFilename(exportRequest);

    this.angulartics2.eventTrack.next({
      action: 'Export Group Results by Items',
      properties: {
        category: 'Export'
      }
    });

    this.csvExportService.exportResultItems(exportRequest, filename);
  }

  exportWritingTraitScoresToCsv(exportRequest: ExportWritingTraitsRequest) {
    let filename: string = this.getFilename(exportRequest);

    this.angulartics2.eventTrack.next({
      action: 'Export Group Writing Trait Scores',
      properties: {
        category: 'Export'
      }
    });

    this.csvExportService.exportWritingTraitScores(exportRequest, filename);
  }

  private getFilename(exportRequest: ExportRequest) {
    let assessment: Assessment = exportRequest.assessment;
    let filename: string = this.group.name +
      "-" + assessment.label + "-" + this.translate.instant(exportRequest.type.toString()) + "-" + new Date().toDateString();
    return filename;
  }
}
