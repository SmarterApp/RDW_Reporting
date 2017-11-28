import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { School } from "../../user/model/school.model";
import { User } from "../../user/model/user.model";

@Injectable()
export class CurrentSchoolResolve implements Resolve<School> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<School>|Promise<School>|School {
    let user: User= route.parent.data["user"];
    let schoolId = route.params["schoolId"];

    return user.schools.find(school => school.id == schoolId);
  }

  constructor() {
  }
}
