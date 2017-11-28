import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { UserService } from "./user.service";

/*
  Allows access to a route only if a user has at least one of the permissions
  defined in the route.data.permissions.
 */
@Injectable()
export class AuthorizeCanActivate implements CanActivate {

  constructor(private _service : UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    return this._service.doesCurrentUserHaveAtLeastOnePermission(route.data["permissions"]);
  }
}
