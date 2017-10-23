import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { isNullOrUndefined } from "util";
import { ImportResult } from "./import-result.model";
import { DataService } from "../../shared/data/data.service";

/**
 * This service is responsible for retrieving student group batches
 */
@Injectable()
export class GroupImportService {

  constructor(private dataService: DataService) {
  }

  findStudentGroupBatches(): Observable<ImportResult[]> {
    return this.dataService
      .get(`/studentGroupBatches`)
      .map((apiStudentGroupBatch) => this.mapWarehouseImportsFromApi(apiStudentGroupBatch));
  }

  mapImportResultFromApi(apiModel: any): ImportResult {
    let uiModel = new ImportResult();
    uiModel.id = apiModel.id;
    uiModel.digest = apiModel.digest;
    uiModel.message = apiModel.message;
    uiModel.fileName = apiModel.filename;
    uiModel.created = apiModel.created;
    uiModel.updated = apiModel.updated;
    uiModel.status = apiModel.status;
    return uiModel;
  }

  private mapWarehouseImportsFromApi(apiStudentGroupBatch: any[]): ImportResult[] {
    if (isNullOrUndefined(apiStudentGroupBatch)) return [];
    return apiStudentGroupBatch
      .filter(apiStudentGroupBatch => !isNullOrUndefined(apiStudentGroupBatch))
      .map(apiStudentGroupBatch => this.mapImportResultFromApi(apiStudentGroupBatch));
  }
}
