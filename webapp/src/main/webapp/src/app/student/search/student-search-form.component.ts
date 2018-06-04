import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControlValueAccessor } from '../../shared/form/abstract-control-value-accessor';
import { StudentSearchForm } from './student-search-form';
import { Forms } from '../../shared/form/forms';
import { Option } from './school-and-group-typeahead.component';

@Component({
  selector: 'student-search-form',
  templateUrl: './student-search-form.component.html',
  providers: [
    Forms.valueAccessor(StudentSearchFormComponent)
  ]
})
export class StudentSearchFormComponent extends AbstractControlValueAccessor<StudentSearchForm> {

  @Input()
  schoolAndGroupTypeaheadOptions: Option[];

  @Input()
  advancedFilterCount: number = 0;

  @Output()
  schoolOrGroupChange: EventEmitter<Option> = new EventEmitter<Option>();

  @Output()
  nameOrSsidChange: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  showAdvancedFiltersChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  showAdvancedFilters: boolean;

  constructor() {
    super();
  }

  get initialized(): boolean {
    return this.schoolAndGroupTypeaheadOptions != null && this.value != null;
  }

  onSchoolOrGroupChange(): void {
    this.schoolOrGroupChange.emit(this.value.schoolOrGroup);
  }

  onNameOrSsidChange(): void {
    this.nameOrSsidChange.emit(this.value.nameOrSsid);
  }

  onAdvancedFiltersToggleClick(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
    this.showAdvancedFiltersChange.emit(this.showAdvancedFilters);
  }

}
