import { Component, Input, OnInit } from '@angular/core';
import { Group } from './group';

@Component({
  selector: 'groups',
  templateUrl: 'groups.component.html'
})
export class GroupsComponent implements OnInit {

  @Input()
  groups: Group[];

  defaultGroup: Group;
  search: string;
  searchThreshold: number = 10;
  filteredGroups: Group[] = [];

  ngOnInit(): void {
    this.filteredGroups = this.groups.concat();
    if (this.groups.length) {
      this.defaultGroup = this.groups[ 0 ];
    }
  }

  onSearchChange(): void {
    this.filteredGroups = this.groups.filter( group =>
      group.name.toLowerCase().indexOf(this.search.toLowerCase()) >= 0);
  }

}
