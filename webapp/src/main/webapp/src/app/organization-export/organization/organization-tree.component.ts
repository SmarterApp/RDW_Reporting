import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Organization } from './organization';
import { Tree } from './tree';

@Component({
  selector: 'organization-tree',
  templateUrl: './organization-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationTreeComponent {
  @Output()
  select: EventEmitter<Organization> = new EventEmitter();

  @Input()
  model: Tree<Organization> = new Tree();

  @Input()
  disabled: boolean = false;

  @Input()
  hasSelectedSchools: boolean = false;

  onClick(organization: Organization): void {
    this.select.emit(organization);
  }
}
