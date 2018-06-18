import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GroupAssessmentService, Search } from './group-assessment.service';
import { AssessmentExam } from '../../assessments/model/assessment-exam.model';

@Injectable()
export class GroupAssessmentResolve implements Resolve<AssessmentExam> {

  constructor(private service: GroupAssessmentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AssessmentExam> {
    return this.service.getMostRecentAssessment(<Search>route.params);
  }

}
