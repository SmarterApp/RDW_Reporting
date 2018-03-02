import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { GroupAssessmentService } from "./group-assessment.service";

@Injectable()
export class GroupAssessmentsResolve implements Resolve<any> {

  constructor(private service: GroupAssessmentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getMostRecentAssessment(route.params[ 'groupId' ], route.params[ 'schoolYear' ]);
  }

}
