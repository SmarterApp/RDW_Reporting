import { Component, Input, OnInit } from '@angular/core';
import { InstructionalResource } from "../model/instructional-resources.model";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'instructional-resource-popover',
  templateUrl: './instructional-resource-popover.component.html'
})
export class InstructionalResourcePopoverComponent implements OnInit {

  @Input()
  provider: () => Observable<InstructionalResource[]>;

  public resources: InstructionalResource[] = [];
  public loading: boolean = true;

  ngOnInit(): void {
    this.provider().subscribe((resources) => {
      this.loading = false;
      this.resources = resources;
    })
  }
}
