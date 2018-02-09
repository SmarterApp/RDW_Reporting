import { Observable } from "rxjs/Observable";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { Report } from "../../report/report.model";
import { AggregateReportService } from "../aggregate-report.service";

/**
 * This resolver is responsible for fetching an aggregate report based upon a report id path parameter
 */
@Injectable()
export class AggregateReportResolve implements Resolve<Report> {

  constructor(private service: AggregateReportService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Report> {
    const reportId = Number.parseInt(route.params[ 'id' ]);
    return this.service.getReportById(reportId);
  }

}
