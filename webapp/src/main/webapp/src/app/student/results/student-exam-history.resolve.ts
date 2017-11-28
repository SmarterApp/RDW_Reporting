import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { StudentExamHistory } from "../model/student-exam-history.model";
import { Observable } from "rxjs/Observable";
import { StudentExamHistoryService } from "../student-exam-history.service";

@Injectable()
export class StudentExamHistoryResolve implements Resolve<StudentExamHistory> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this.service.findOneById(route.params[ "studentId" ]);
  }

  constructor(private service: StudentExamHistoryService) {
  }

}
