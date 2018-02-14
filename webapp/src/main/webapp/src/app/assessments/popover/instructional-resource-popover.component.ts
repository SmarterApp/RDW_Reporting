import { Component, Input, OnInit } from '@angular/core';
import { InstructionalResource } from "../model/instructional-resources.model";
import { Observable } from "rxjs/Observable";
import { Utils } from "../../shared/support/support";
import "rxjs/add/operator/delay";

@Component({
  selector: 'instructional-resource-popover',
  templateUrl: './instructional-resource-popover.component.html'
})
export class InstructionalResourcePopoverComponent implements OnInit {

  @Input()
  provider: () => Observable<InstructionalResource[]>;
  resources: InstructionalResource[];

  ngOnInit(): void {
    this.provider().subscribe(resources => {
      this.resources = resources;
    });
  }

  get loading(): boolean {
    return Utils.isUndefined(this.resources);
  }

}
