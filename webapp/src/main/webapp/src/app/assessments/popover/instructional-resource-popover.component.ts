import { Component, Input } from '@angular/core';
import { InstructionalResource } from "../model/instructional-resources.model";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'instructional-resource-popover',
  templateUrl: './instructional-resource-popover.component.html'
})
export class InstructionalResourcePopoverComponent {

  constructor(private translateService: TranslateService) {}

  @Input()
  resources: InstructionalResource[];

  @Input()
  performanceLevel: number;

}
