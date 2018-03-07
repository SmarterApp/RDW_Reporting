import { Observable } from "rxjs/Observable";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { ReportService } from "./report.service";
import { Report } from "./report.model";
import { Resolution } from "../shared/resolution.model";
import { catchError, map } from 'rxjs/operators';

/**
 * This resolver is responsible for fetching assessment items for a student and exam.
 */
@Injectable()
export class ReportsResolve implements Resolve<Resolution<Report[]>> {

  constructor(private service: ReportService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Resolution<Report[]>> {
    return this.service.getReports()
      .pipe(
        map(Resolution.ok),
        catchError(Resolution.errorObservable)
      );
  }

}
