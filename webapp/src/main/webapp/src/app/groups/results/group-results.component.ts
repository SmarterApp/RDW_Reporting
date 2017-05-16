import { Component, OnInit } from '@angular/core';
import { DataService } from "../../shared/data.service";

@Component({
  selector: 'app-group-results',
  templateUrl: './group-results.component.html',
})
export class GroupResultsComponent implements OnInit {
  private groups;

  constructor(private service : DataService ) {

  }

  ngOnInit() {
    this.service.getGroups().subscribe(groups => {
      this.groups = groups;
    })
  }


}
