import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserGroupService } from './user-group.service';
import { UserGroup } from './user-group';
import { of } from 'rxjs/observable/of';

@Injectable()
export class UserGroupResolve implements Resolve<UserGroup> {

  constructor(private service: UserGroupService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserGroup> {
    const { groupId } = route.params;
    return groupId
      ? this.service.getGroup(groupId)
      : of(null);
  }

}
