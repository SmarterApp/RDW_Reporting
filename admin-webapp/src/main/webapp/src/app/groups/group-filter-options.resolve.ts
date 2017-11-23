import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { GroupFilterOptions } from "./model/group-filter-options.model";
import { GroupService } from "./groups.service";
import { UserService } from "../user/user.service";
import { User } from "../user/model/user.model";

const AdminPermissions = [ 'GROUP_WRITE' ];

@Injectable()
export class GroupFilterOptionsResolve implements Resolve<GroupFilterOptions> {

  private _user: User;

  get user(): User {
    return this._user;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GroupFilterOptions> | Promise<GroupFilterOptions> | GroupFilterOptions {
    let userHasAccess: boolean;
    this._userService.getCurrentUser().subscribe(user => {
      userHasAccess = user.permissions.some(permission => AdminPermissions.indexOf(permission) !== -1);

    });
    if (userHasAccess) {
      return this.service.getFilterOptions();

    }
  }

  constructor(private service: GroupService,
              private _userService: UserService) {
  }
}
