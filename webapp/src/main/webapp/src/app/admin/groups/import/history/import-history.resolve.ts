import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { ImportResult } from "../import-result.model";
import { Observable } from "rxjs/Observable";
import { GroupImportService } from "../group-import.service";

@Injectable()
export class ImportHistoryResolve implements Resolve<ImportResult[]> {

  constructor(private service: GroupImportService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ImportResult[]> {
    return this.service.findStudentGroupBatches();
  }

}
