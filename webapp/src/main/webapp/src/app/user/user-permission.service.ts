import { UserService } from "./user.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { map } from 'rxjs/operators';

@Injectable()
export class UserPermissionService {

  constructor(private userService: UserService){
  }

  getPermissions(): Observable<string[]> {
    return this.userService.getCurrentUser()
      .pipe(
        map(user =>  user ? user.permissions : [])
      );
  }

}
