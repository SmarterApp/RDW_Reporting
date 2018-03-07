import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { School } from "../../user/model/school.model";

@Injectable()
export class CurrentSchoolResolve implements Resolve<School> {

  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<School> {
    const user = route.parent.data[ 'user' ];
    const schoolId = route.params[ 'schoolId' ];
    return user.schools.find(school => school.id == schoolId);
  }

}
