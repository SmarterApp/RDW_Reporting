import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { SchoolAssessmentService } from "./school-assessment.service";
import { AssessmentExam } from "../../assessments/model/assessment-exam.model";
import { Utils } from "@sbac/rdw-reporting-common-ngx";

@Injectable()
export class SchoolAssessmentResolve implements Resolve<AssessmentExam> {

  constructor(private service: SchoolAssessmentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AssessmentExam>|Promise<AssessmentExam>|AssessmentExam {
    return this.isParamsValid(route.params)
      ? this.service.getMostRecentAssessment(route.params[ "schoolId" ], route.params[ "gradeId" ], route.params[ "schoolYear" ])
      : Observable.empty();
  }

  private isParamsValid(params: any): boolean {
    return !Utils.isNullOrUndefined(params[ "schoolId" ])
      && !Utils.isNullOrUndefined(params[ "gradeId" ]);
  }

}
