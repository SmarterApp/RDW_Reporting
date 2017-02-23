import {Component, OnInit} from "@angular/core";
import {DataService} from "../shared/data.service";
import {Group} from "../shared/group";

@Component({
  selector: 'groups-component',
  templateUrl: './groups.component.html',
  styleUrls: ['groups.component.less']
})
export class GroupsComponent implements OnInit {

  groups: Array<Group> = null;

  constructor(private service: DataService) {}

  ngOnInit() {
    this.service.getGroupSummaries()
      .subscribe(groups => {
          this.groups = groups;
        },
        error => {
          console.error(error);
        })
  }

}
