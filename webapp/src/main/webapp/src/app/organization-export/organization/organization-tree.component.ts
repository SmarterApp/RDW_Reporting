import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Organization } from "./organization";
import { Tree } from "./tree";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'organization-tree',
  templateUrl: './organization-tree.component.html'
})
export class OrganizationTreeComponent {

  constructor (private translate: TranslateService) {}

  @Output()
  select: EventEmitter<Organization> = new EventEmitter();

  @Input()
  model: Tree<Organization> = new Tree();

  @Input()
  disabled: boolean = false;

  onClick(organization: Organization): void {
    this.select.emit(organization);
  }

}


