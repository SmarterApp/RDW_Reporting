import { Component, OnInit } from '@angular/core';
import { UserGroupService } from './user-group.service';
import { UserGroup } from './user-group';

@Component({
  selector: 'user-groups',
  templateUrl: './user-groups.component.html'
})
export class UserGroupsComponent implements OnInit {

  groups: UserGroup[];
  defaultGroup: UserGroup;

  search: string;
  searchThreshold: number = 10;
  filteredGroups: UserGroup[];

  constructor(private service: UserGroupService) {
  }

  ngOnInit(): void {
    this.service.getGroups()
      .subscribe(groups => {
        this.groups = groups;
        this.filteredGroups = groups.concat();

        if (groups && groups.length) {
          this.defaultGroup = groups[ 0 ];
        }
      });
  }

  onSearchChange() {
    this.filteredGroups = this.groups
      .filter( group => group.name.toLowerCase().includes(this.search.toLowerCase()));
  }

  get emptyMessageCode(): string {
    return this.groups && this.groups.length > 0 ?
      'groups.empty-message' :
      'groups.no-groups-message';
  }

}
