import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { StudentExamHistory } from "../model/student-exam-history.model";
import { Observable } from "rxjs/Observable";
import { StudentExamHistoryService } from "../student-exam-history.service";

@Injectable()
export class StudentExamHistoryResolve implements Resolve<StudentExamHistory> {

  constructor(private service: StudentExamHistoryService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<StudentExamHistory> {
    const { studentId } = route.params;
    return this.service.findOneById(studentId);
  }

}
