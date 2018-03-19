import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ImportResult } from "./import-result.model";
import { DataService } from "../../../shared/data/data.service";
import { Utils } from "../../../shared/support/support";
import { map } from 'rxjs/operators';
import { AdminServiceRoute } from '../../../shared/service-route';

const ServiceRoute = AdminServiceRoute;

/**
 * This service is responsible for retrieving student group batches
 */
@Injectable()
export class GroupImportService {

  constructor(private dataService: DataService) {
  }

  findStudentGroupBatches(): Observable<ImportResult[]> {
    return this.dataService
      .get(`${ServiceRoute}/studentGroupBatches`)
      .pipe(
        map(apiStudentGroupBatch => this.mapWarehouseImportsFromApi(apiStudentGroupBatch))
      );
  }

  mapImportResultFromApi(serverResult: any): ImportResult {
    const result = new ImportResult();
    result.id = serverResult.id;
    result.digest = serverResult.digest;
    result.message = serverResult.message;
    result.fileName = serverResult.filename;
    result.created = serverResult.created;
    result.updated = serverResult.updated;
    result.status = serverResult.status;
    return result;
  }

  private mapWarehouseImportsFromApi(serverResults: any[]): ImportResult[] {
    if (Utils.isNullOrUndefined(serverResults)) {
      return [];
    }
    return serverResults
      .filter(serverResult => !Utils.isNullOrUndefined(serverResult))
      .map(serverResult => this.mapImportResultFromApi(serverResult));
  }

}
