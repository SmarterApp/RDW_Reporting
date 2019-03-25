import { Component, Input, OnInit } from '@angular/core';
import { UserGroupService } from './user-group.service';
import { UserGroup } from './user-group';
import { PermissionService } from '../shared/security/permission.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { Group } from '../groups/group';
import { SubjectService } from '../subject/subject.service';

@Component({
  selector: 'user-groups',
  templateUrl: './user-groups.component.html'
})
export class UserGroupsComponent implements OnInit {

  /**
   * The assigned groups
   */
  @Input()
  assignedGroups: Group[];

  /**
   * The user created groups
   */
  @Input()
  groups: UserGroup[];

  defaultGroup: UserGroup;
  subjects: string[];
  createButtonDisabled: boolean = true;

  search: string;
  searchThreshold: number = 10;
  filteredGroups: UserGroup[];

  initialized: boolean = false;

  constructor(private service: UserGroupService,
              private subjectService: SubjectService,
              private permissionService: PermissionService,
              private router: Router) {
  }

  ngOnInit(): void {
    forkJoin(
      this.subjectService.getSubjectCodes(),
      this.permissionService.getPermissions()
    ).subscribe(([ subjects, permissions ]) => {
      this.filteredGroups = this.groups.concat();
      if (this.groups.length !== 0) {
        this.defaultGroup = this.groups[ 0 ];
      }
      this.subjects = subjects;
      this.createButtonDisabled = this.assignedGroups.length === 0
        && permissions.indexOf('INDIVIDUAL_PII_READ') === -1;
      this.initialized = true;
    });
  }

  onSearchChange(): void {
    this.filteredGroups = this.groups
      .filter(group => group.name.toLowerCase().includes(this.search.toLowerCase()));
  }

  onCreateButtonClick(): void {
    if (!this.createButtonDisabled) {
      this.router.navigate([ '/user-groups' ]);
    }
  }

}
