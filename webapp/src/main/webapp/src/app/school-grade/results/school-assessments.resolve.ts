import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { SchoolAssessmentService } from "./school-assessment.service";
import { AssessmentExam } from "../../assessments/model/assessment-exam.model";
import { isNullOrUndefined } from "util";

@Injectable()
export class SchoolAssessmentResolve implements Resolve<AssessmentExam> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AssessmentExam>|Promise<AssessmentExam>|AssessmentExam {
    // TODO: Check params to return most recent or custom.
    return this.isParamsValid(route.params)
      ? this.service.getMostRecentAssessment(route.params[ "schoolId" ], route.params[ "gradeId" ], route.params[ "schoolYear" ])
        .toPromise()
        .then(value => {
          return value;
        })
      : Observable.empty();
  }

  private isParamsValid(params){
    return !isNullOrUndefined(params[ "schoolId" ])
      && !isNullOrUndefined(params[ "gradeId" ]);
  }

  constructor(private service: SchoolAssessmentService) {
  }
}
