import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'groups',
  templateUrl: 'groups.component.html'
})
export class GroupsComponent implements OnInit {
  /**
   * The array of groups that a user has access to.
   */
  @Input()
  groups = [];

  filteredGroups = [];
  searchTerm : string;

  constructor() {}

  ngOnInit() {
    this.filteredGroups = this.groups;
  }

  onSearchChange(event) {
    this.filteredGroups = this.groups.filter( x => x.name.toUpperCase().indexOf(this.searchTerm.toUpperCase()) >= 0)
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
