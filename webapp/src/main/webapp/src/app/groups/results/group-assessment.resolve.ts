import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GroupAssessmentService, Search } from './group-assessment.service';
import { empty } from 'rxjs/observable/empty';
import { AssessmentExam } from '../../assessments/model/assessment-exam.model';

@Injectable()
export class GroupAssessmentResolve implements Resolve<AssessmentExam> {

  constructor(private service: GroupAssessmentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AssessmentExam> {
    // if there are pre-selected assessments, don't call to get the most recent assessment
    const { schoolYear, assessmentIds } = route.params;
    if (schoolYear == null || assessmentIds != null) {
      return empty();
    }
    return this.service.getMostRecentAssessment(<Search>route.params);
  }

}
