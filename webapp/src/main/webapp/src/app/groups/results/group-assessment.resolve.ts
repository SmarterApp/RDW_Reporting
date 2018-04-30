import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GroupAssessmentService } from './group-assessment.service';

@Injectable()
export class GroupAssessmentResolve implements Resolve<any> {

  constructor(private service: GroupAssessmentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const { groupId, schoolYear } = route.params;
    return this.service.getMostRecentAssessment(groupId, schoolYear);
  }

}
