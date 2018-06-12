import { Component, Input, OnInit } from '@angular/core';
import { UserGroupService } from './user-group.service';
import { UserGroup } from './user-group';
import { FilterOptionsService } from '../shared/filter/filter-options.service';
import { PermissionService } from '../shared/security/permission.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Router } from '@angular/router';

@Component({
  selector: 'user-groups',
  templateUrl: './user-groups.component.html'
})
export class UserGroupsComponent implements OnInit {

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
              private filterOptionService: FilterOptionsService,
              private permissionService: PermissionService,
              private router: Router) {
  }

  ngOnInit(): void {
    forkJoin(
      this.filterOptionService.getFilterOptions(),
      this.permissionService.getPermissions()
    ).subscribe(([ options, permissions ]) => {
      this.filteredGroups = this.groups.concat();
      if (this.groups.length) {
        this.defaultGroup = this.groups[ 0 ];
      }
      this.subjects = options.subjects;
      this.createButtonDisabled = this.groups.length === 0
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
