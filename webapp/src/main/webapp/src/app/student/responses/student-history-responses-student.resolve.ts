
import { StudentHistoryExamWrapper } from "../model/student-history-exam-wrapper.model";
import { StudentExamHistory } from "../model/student-exam-history.model";
import { Exam } from "../../assessments/model/exam.model";
import { RouterStateSnapshot, ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Injectable } from "@angular/core";
import { Student } from "../model/student.model";

/**
 * This resolver is responsible for fetching the responses student from the parent route's data.
 */
@Injectable()
export class StudentHistoryResponsesStudentResolve implements Resolve<Student> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Student {
    let examId: number = route.params[ "examId" ];
    let history: StudentExamHistory = route.parent.data[ "examHistory" ];
    if (!history) {
      throw("Cannot resolve parent's StudentExamHistory");
    }

    return history.student;
  }

}
