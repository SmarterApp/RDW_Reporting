import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { School } from "../../user/model/school.model";
import { OrganizationService } from '../organization.service';
import { map } from 'rxjs/operators';

@Injectable()
export class CurrentSchoolResolve implements Resolve<School> {

  constructor(private organizationService: OrganizationService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<School> {
    const { schoolId } = route.params;
    return this.organizationService.getSchoolsWithDistricts().pipe(
      map(schools => schools.find(school => school.id == schoolId))
    );
  }

}
