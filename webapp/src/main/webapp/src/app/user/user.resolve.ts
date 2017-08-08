import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "./user.service";
import { User } from "./model/user.model";

@Injectable()
export class UserResolve implements Resolve<User> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User>|Promise<User>|User|any {
    return this.service.getCurrentUser();
  }

  constructor(private service: UserService) {
  }
}
