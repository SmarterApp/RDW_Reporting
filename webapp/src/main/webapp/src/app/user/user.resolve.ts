import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { UserService } from "./user.service";
import { User } from "./model/user.model";

@Injectable()
export class UserResolve implements Resolve<User> {

  constructor(private service: UserService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return this.service.getCurrentUser();
  }

}
