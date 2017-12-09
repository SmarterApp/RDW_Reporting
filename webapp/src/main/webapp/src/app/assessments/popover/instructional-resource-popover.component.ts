import { Component, Input } from '@angular/core';
import { InstructionalResource } from "../model/instructional-resources.model";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'instructional-resource-popover',
  templateUrl: './instructional-resource-popover.component.html'
})
export class InstructionalResourcePopoverComponent {

  constructor(private sanitizer: DomSanitizer) {
  }

  @Input()
  resources: InstructionalResource[];

  @Input()
  performanceLevel: number;

}
