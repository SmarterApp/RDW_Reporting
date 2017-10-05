import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { OrganizationService } from "./organization.service";
import { UserOrganizations } from "./user-organizations";

@Injectable()
export class UserOrganizationsResolve implements Resolve<UserOrganizations> {

  constructor(private service: OrganizationService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserOrganizations> {
    return this.service.getUserOrganizations();
  }

}
