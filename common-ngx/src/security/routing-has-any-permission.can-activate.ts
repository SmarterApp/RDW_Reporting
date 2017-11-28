import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { PermissionService } from "./permission.service";

export const AccessDeniedRoute = new InjectionToken<string>('AccessDeniedRoute');

/**
 * Allows access to a route as long as the permissions are not empty.
 */
@Injectable()
export class RoutingHasAnyPermissionCanActivate implements CanActivate {

  constructor(@Inject(AccessDeniedRoute) private accessDeniedRoute: string,
              private permissionService: PermissionService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.permissionService.getPermissions()
      .map(permissions => {
        const hasPermission: boolean = (permissions || []).length > 0;
        if (!hasPermission) {
          this.router.navigate([ this.accessDeniedRoute ]);
        }
        return hasPermission;
      });
  }
}
