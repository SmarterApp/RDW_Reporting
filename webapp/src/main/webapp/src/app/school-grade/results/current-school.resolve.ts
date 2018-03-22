import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { School } from "../../shared/organization/organization";
import { SchoolService } from "../../shared/school/school.service";

@Injectable()
export class CurrentSchoolResolve implements Resolve<School> {

  constructor(private schoolService: SchoolService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<School> {
    const { schoolId } = route.params;
    return this.schoolService.getSchool(schoolId);
  }

}
