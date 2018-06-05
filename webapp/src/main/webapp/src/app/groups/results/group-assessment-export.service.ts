import { Injectable } from '@angular/core';
import { ExportItemsRequest } from '../../assessments/model/export-items-request.model';
import { ExportWritingTraitsRequest } from '../../assessments/model/export-writing-trait-request.model';
import { Angulartics2 } from 'angulartics2';
import { CsvExportService } from '../../csv-export/csv-export.service';

@Injectable()
export class GroupAssessmentExportService {

  constructor(private service: CsvExportService,
              private angulartics2: Angulartics2) {
  }

  exportItemsToCsv(request: ExportItemsRequest, filename: string) {
    this.angulartics2.eventTrack.next({
      action: 'Export Group Results by Items',
      properties: {
        category: 'Export'
      }
    });

    this.service.exportResultItems(request, filename);
  }

  exportWritingTraitScoresToCsv(request: ExportWritingTraitsRequest, filename: string) {
    this.angulartics2.eventTrack.next({
      action: 'Export Group Writing Trait Scores',
      properties: {
        category: 'Export'
      }
    });

    this.service.exportWritingTraitScores(request, filename);
  }

}
