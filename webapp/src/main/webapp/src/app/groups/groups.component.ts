import { Component, OnInit } from "@angular/core";
import { Group } from './group';
import { GroupService } from './group.service';

@Component({
  selector: 'groups',
  templateUrl: 'groups.component.html'
})
export class GroupsComponent implements OnInit {

  groups: Group[];
  defaultGroup: Group;

  search: string;
  searchThreshold: number = 10;
  filteredGroups: Group[] = [];

  columns: Column[] = [
    new Column({id: 'group', field: 'name'}),
    new Column({id: 'school', field: 'schoolName'}),
    new Column({id: 'subject', field: 'subjectCode'})
  ];

  constructor(private groupService: GroupService) {
    this.groupService.getGroups().subscribe(groups => {
      const groupsCopy = groups.concat();
      this.groups = groupsCopy;
      this.filteredGroups = groupsCopy;

      if (this.groups && this.groups.length != 0) {
        this.defaultGroup = this.groups[ 0 ];
      }
    });
  }

  ngOnInit() {
    this.filteredGroups = this.groups;
  }

  onSearchChange() {
    this.filteredGroups = this.groups.filter( group =>
      group.name.toLowerCase().indexOf(this.search.toLowerCase()) >= 0);
  }

  /**
   * Determines if the empty message displayed should be for when there are groups and the filter didn't have any matches
   * or if there were never any groups to start with
   *
   * @returns {string} translation key to use
   */
  get emptyMessageTranslateKey(): string {
    return this.groups && this.groups.length ?
      'groups.empty-message' :
      'groups.no-groups-message';
  }

}

class Column {
  id: string;
  field: string;

  constructor({
                id,
                field = ''
  }) {
    this.id = id;
    this.field = field;
  }
}
