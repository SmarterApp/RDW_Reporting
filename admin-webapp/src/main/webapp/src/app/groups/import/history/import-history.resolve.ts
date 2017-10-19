import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ImportResult } from "../import-result.model";
import { Observable } from "rxjs";
import { GroupImportService } from "../group-import.service";

@Injectable()
export class ImportHistoryResolve implements Resolve<ImportResult[]> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ImportResult[]>|Promise<ImportResult[]>|ImportResult[] {
    return this.service.findStudentGroupBatches();
  }

  constructor(private service: GroupImportService) {
  }
}
