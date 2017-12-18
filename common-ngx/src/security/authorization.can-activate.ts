import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AuthorizationService } from "./authorization.service";

/**
 * Allows access to a route if a user has at least one of the permissions in ActivatedRouteSnapshot.data.permissions.
 */
@Injectable()
export class AuthorizationCanActivate implements CanActivate {

  constructor(private authorizationService: AuthorizationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authorizationService.hasAnyPermission(route.data[ 'permissions' ]);
  }

}
