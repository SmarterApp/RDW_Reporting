import { Injectable } from "@angular/core";
import { DataService } from "../../shared/data.service";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AssessmentService } from "./assessment/assessment.service";

@Injectable()
export class AssessmentsResolve implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    // TODO: Check params to return most recent or custom.
    return this.service.getMostRecentAssessment(route.params[ "groupId" ], route.params[ "schoolYear" ])
      .toPromise()
      .then( value => {
        return value;
      })
  }

  constructor(private service: AssessmentService) {
  }
}
