import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Assessment } from "../../assessments/model/assessment.model";
import { Observable } from "rxjs";
import { StudentExamHistory } from "../model/student-exam-history.model";
import { StudentHistoryExamWrapper } from "../model/student-history-exam-wrapper.model";

/**
 * This resolver is responsible for fetching the responses assessment from the parent route's data.
 */
@Injectable()
export class StudentHistoryResponsesAssessmentResolve implements Resolve<Assessment> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Assessment> {
    let examId: number = route.params[ "examId" ];
    let history: StudentExamHistory = route.parent.data[ "examHistory" ];
    if (!history) return Observable.throw("Cannot resolve parent's StudentExamHistory");

    let wrappers: StudentHistoryExamWrapper[] = history.exams;
    let wrapper: StudentHistoryExamWrapper = wrappers.find( (wrapper) => wrapper.exam.id == examId );
    return wrapper ? Observable.of(wrapper.assessment) : Observable.throw("Assessment not found");
  }

}
