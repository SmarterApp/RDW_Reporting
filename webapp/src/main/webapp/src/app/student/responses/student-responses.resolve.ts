import { Observable } from "rxjs";
import { RouterStateSnapshot, ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Injectable } from "@angular/core";
import { StudentResponsesService } from "./student-responses.service";
import { AssessmentItem } from "../../assessments/model/assessment-item.model";

/**
 * This resolver is responsible for fetching assessment items for a student and exam.
 */
@Injectable()
export class StudentResponsesResolve implements Resolve<AssessmentItem[]> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AssessmentItem[]> {
    return this.service.findItemsByStudentAndExam(route.params[ "studentId" ], route.params["examId"]);
  }

  constructor(private service: StudentResponsesService) {
  }

}
