import { Component, OnInit } from '@angular/core';
import { Group } from './group';
import { UserGroup } from '../user-group/user-group';
import { UserService } from '../user/user.service';
import { UserGroupService } from '../user-group/user-group.service';
import { GroupService } from './group.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'group-tabs',
  templateUrl: './group-tabs.component.html'
})
export class GroupTabsComponent implements OnInit {

  groups: Group[];
  userGroups: UserGroup[];
  initialized: boolean;

  constructor(private userService: UserService,
              private groupService: GroupService,
              private userGroupService: UserGroupService) {
  }

  ngOnInit(): void {
    forkJoin(
      this.groupService.getGroups(),
      this.userGroupService.getGroups().pipe(
        // interpret error as permission denied
        catchError(() => of(null))
      )
    ).subscribe(([groups, userGroups]) => {
      this.groups = groups;
      this.userGroups = userGroups;
      this.initialized = true;
    });
  }

}
