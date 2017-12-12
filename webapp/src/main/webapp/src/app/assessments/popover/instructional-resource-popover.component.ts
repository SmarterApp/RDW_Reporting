import { Component, Input } from '@angular/core';
import { InstructionalResource } from "../model/instructional-resources.model";

@Component({
  selector: 'instructional-resource-popover',
  templateUrl: './instructional-resource-popover.component.html'
})
export class InstructionalResourcePopoverComponent {

  @Input()
  resources: InstructionalResource[];

  @Input()
  performanceLevel: number;

}
