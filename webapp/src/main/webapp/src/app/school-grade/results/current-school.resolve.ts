import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { School } from "../../shared/organization/organization";
import { OrganizationService } from "../../shared/organization/organization.service";

@Injectable()
export class CurrentSchoolResolve implements Resolve<School> {

  constructor(private organizationService: OrganizationService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<School> {
    const { schoolId } = route.params;
    return this.organizationService.getSchool(schoolId);
  }

}
