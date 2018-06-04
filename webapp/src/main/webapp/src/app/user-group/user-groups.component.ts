import { Component, Input, OnInit } from '@angular/core';
import { UserGroupService } from './user-group.service';
import { UserGroup } from './user-group';
import { FilterOptionsService } from '../shared/filter/filter-options.service';

@Component({
  selector: 'user-groups',
  templateUrl: './user-groups.component.html'
})
export class UserGroupsComponent implements OnInit {

  @Input()
  groups: UserGroup[];

  defaultGroup: UserGroup;
  subjects: string[];

  search: string;
  searchThreshold: number = 10;
  filteredGroups: UserGroup[];

  initialized: boolean = false;

  constructor(private service: UserGroupService,
              private filterOptionService: FilterOptionsService) {
  }

  ngOnInit(): void {
    this.filterOptionService.getFilterOptions().subscribe(options => {
      this.filteredGroups = this.groups.concat();
      if (this.groups.length) {
        this.defaultGroup = this.groups[ 0 ];
      }
      this.subjects = options.subjects;
      this.initialized = true;
    });
  }

  onSearchChange() {
    this.filteredGroups = this.groups
      .filter(group => group.name.toLowerCase().includes(this.search.toLowerCase()));
  }

}
