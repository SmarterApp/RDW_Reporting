import { UserService } from "./user.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

@Injectable()
export class UserPermissionService {

  constructor(private userService: UserService){
  }

  getPermissions(): Observable<string[]> {
    return this.userService.getCurrentUser().map(user => user ? user.permissions : []);
  }

}
