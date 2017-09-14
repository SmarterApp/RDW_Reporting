import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserService } from "./user.service";

/*
 Allows access to a route as long as the permissions are not empty.
 */
@Injectable()
export class AuthorizeAtleastOneCanActivate implements CanActivate {

  constructor(private _service : UserService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    let observable = this._service.doesCurrentUserHaveAnyPermissions().share();

    observable.subscribe(hasPermissions => {
      if(hasPermissions) {
        return true;
      } else {
        this.router.navigate(['access-denied']);
        return false;
      }
    });

    return observable;
  }
}
