import { Component, OnInit } from "@angular/core";
import { Group } from '../groups/group';
import { GroupService } from './group.service';

@Component({
  selector: 'groups',
  templateUrl: 'groups.component.html'
})
export class GroupsComponent implements OnInit {

  groups: Group[];
  filteredGroups: Group[] = [];
  searchTerm : string;

  constructor(private groupService: GroupService) {
    this.groupService.getGroups().subscribe(groups => {
      const groupsCopy = groups.concat();
      this.groups = groupsCopy;
      this.filteredGroups = groupsCopy;
    })
  }

  ngOnInit() {
    this.filteredGroups = this.groups;
  }

  onSearchChange(event) {
    this.filteredGroups = this.groups.filter( group =>
      group.name.toUpperCase().indexOf(this.searchTerm.toUpperCase()) >= 0);
  }

  /**
   * Determines if the empty message displayed should be for when there are groups and the filter didn't have any matches
   * or if there were never any groups to start with
   *
   * @returns {string} translation key to use
   */
  get emptyMessageTranslateKey(): string {
    return this.groups && this.groups.length != 0 ?
      'labels.groups.empty-message' :
      'labels.groups.no-groups-message';
  }

}
