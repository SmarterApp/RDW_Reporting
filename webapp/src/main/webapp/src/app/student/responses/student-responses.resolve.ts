import { Observable } from "rxjs/Observable";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { StudentResponsesService } from "./student-responses.service";
import { AssessmentItem } from "../../assessments/model/assessment-item.model";

/**
 * This resolver is responsible for fetching assessment items for a student and exam.
 */
@Injectable()
export class StudentResponsesResolve implements Resolve<AssessmentItem[]> {

  constructor(private service: StudentResponsesService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AssessmentItem[]> {
    const { studentId, examId } = route.params;
    return this.service.findItemsByStudentAndExam(studentId, examId);
  }

}
