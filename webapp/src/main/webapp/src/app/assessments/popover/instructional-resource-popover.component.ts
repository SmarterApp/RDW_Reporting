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

  linkText(resource: InstructionalResource): string {
    if (resource.organizationLevel === 'System') {
      return this.translateService.instant('labels.instructional-resources.link.System');
    }
    if (resource.organizationLevel === 'State') {
      return this.translateService.instant('labels.states.' + resource.stateCode) + this.translateService.instant('labels.instructional-resources.link.State');
    }
    return this.translateService.instant('labels.instructional-resources.link.' + resource.organizationName, resource);
  }

}
