import { Observable } from "rxjs/Observable";
import { RouterStateSnapshot, ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Injectable } from "@angular/core";
import { ReportService } from "./report.service";
import { Report } from "./report.model";
import { Resolution } from "../shared/resolution.model";

/**
 * This resolver is responsible for fetching assessment items for a student and exam.
 */
@Injectable()
export class ReportsResolve implements Resolve<Resolution<Report[]>> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Resolution<Report[]>> {
    return this.service.getReports()
      .map(Resolution.ok)
      .catch(Resolution.errorObservable);
  }

  constructor(private service: ReportService) {
  }

}
