import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GroupAssessmentService, Search } from './group-assessment.service';

@Injectable()
export class GroupAssessmentResolve implements Resolve<any> {

  constructor(private service: GroupAssessmentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    // if there are pre-selected assessments, don't call to get the most recent assessment
    const { assessmentIds } = route.params;
    if (!assessmentIds) {
      return this.service.getMostRecentAssessment(<Search>route.params);
    }
  }

}
