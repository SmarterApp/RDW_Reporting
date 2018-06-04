import { Component, Input } from '@angular/core';
import { School } from '../../admin/groups/model/school.model';
import { Group } from '../../groups/group';
import { UserGroup } from '../../user-group/user-group';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { AbstractControlValueAccessor } from '../../shared/form/abstract-control-value-accessor';
import { Forms } from '../../shared/form/forms';

export interface Option {
  readonly label: string;
  readonly group: string;
  readonly value: School | Group | UserGroup;
  readonly valueType: 'School' | 'Group' | 'UserGroup';
}

@Component({
  selector: 'school-and-group-typeahead',
  templateUrl: './school-and-group-typeahead.component.html',
  providers: [
    Forms.valueAccessor(SchoolAndGroupTypeaheadComponent)
  ]
})
export class SchoolAndGroupTypeaheadComponent extends AbstractControlValueAccessor<Option> {

  @Input()
  options: Option[] = [];

  search: string = '';

  writeValue(value: any): void {
    super.writeValue(value);
    if (value) {
      this.search = value.label;
    }
  }

  onFocusInternal(): void {
    if (this.value) {
      this.search = '';
    }
  }

  onBlurInternal(): void {
    if (this.value) {
      this.search = this.value.label;
    }
  }

  onChangeInternal(): void {
    this.value = null;
  }

  onSelectInternal(match: TypeaheadMatch): void {
    this.value = match.item;
  }

}
