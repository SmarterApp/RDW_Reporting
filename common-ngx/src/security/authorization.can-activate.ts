import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AuthorizationService } from "./authorization.service";
import { AccessDeniedRoute } from "./routing-authorization.can-activate";

/**
 * Allows access to a route if a user has at least one of the permissions in ActivatedRouteSnapshot.data.permissions.
 * Optionally redirects a user to access denied route if we have route.data[ 'denyAccess' ] = true
 */
@Injectable()
export class AuthorizationCanActivate implements CanActivate {

  constructor(@Inject(AccessDeniedRoute)
              private accessDeniedRoute: string,
              private authorizationService: AuthorizationService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authorizationService.hasAnyPermission(route.data[ 'permissions' ]).map((permission) => {
        console.log('route data', route.data);
        console.log('permission', permission);
        if (!permission && route.data[ 'denyAccess' ]) {
          this.router.navigate([ this.accessDeniedRoute ]);
        }
        return permission;
      }
    );
  }
}


