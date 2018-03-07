import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { PermissionService } from "./permission.service";
import { map } from 'rxjs/operators';

@Injectable()
export class AuthorizationService {

  constructor(private permissionService: PermissionService){
  }

  hasAnyPermission(permissions: string[]): Observable<boolean> {
    return this.permissionService.getPermissions()
      .pipe(
        map(userPermissions => {
          userPermissions = userPermissions || [];
          return (permissions || []).some(permission => userPermissions.indexOf(permission) != -1);
        })
      );
  }

}
