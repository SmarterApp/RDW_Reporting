
import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Exam } from "../../assessments/model/exam.model";
import { Observable } from "rxjs";
import { StudentHistoryExamWrapper } from "../model/student-history-exam-wrapper.model";
import { StudentExamHistory } from "../model/student-exam-history.model";

/**
 * This resolver is responsible for fetching the responses exam from the parent route's data.
 */
@Injectable()
export class StudentHistoryResponsesExamResolve implements Resolve<Exam> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Exam> {
    let examId: number = route.params[ "examId" ];
    let history: StudentExamHistory = route.parent.data[ "examHistory" ];
    if (!history) return Observable.throw("Cannot resolve parent's StudentExamHistory");

    let wrappers: StudentHistoryExamWrapper[] = history.exams;
    let wrapper: StudentHistoryExamWrapper = wrappers.find( (wrapper) => wrapper.exam.id == examId );
    return wrapper ? Observable.of(wrapper.exam) : Observable.throw("Exam not found");
  }

}
