import { Observable } from "rxjs/Observable";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { ReportService } from "../../report/report.service";
import { Report } from "../../report/report.model";

/**
 * This resolver is responsible for fetching assessment items for a student and exam.
 */
@Injectable()
export class AggregateReportResolve implements Resolve<Report> {

  constructor(private service: ReportService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Report> {
    const reportId = Number.parseInt(route.params[ 'id' ]);
    return this.service.getReportById(reportId);
  }

}
