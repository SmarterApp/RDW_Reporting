import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StudentSearchFormOptions } from './student-search-form-options';
import { AbstractControlValueAccessor } from '../../shared/form/abstract-control-value-accessor';
import { StudentSearchForm } from './student-search-form';
import { Forms } from '../../shared/form/forms';
import { School } from '../../shared/organization/organization';
import { Group } from '../../groups/group';

@Component({
  selector: 'student-search-form',
  templateUrl: './student-search-form.component.html',
  providers: [
    Forms.valueAccessor(StudentSearchFormComponent)
  ]
})
export class StudentSearchFormComponent extends AbstractControlValueAccessor<StudentSearchForm> {

  @Input()
  options: StudentSearchFormOptions = {
    schools: [],
    groups: []
  };

  @Output()
  schoolChange: EventEmitter<School> = new EventEmitter<School>();

  @Output()
  groupChange: EventEmitter<Group> = new EventEmitter<Group>();

  @Output()
  nameChange: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  showAdvancedFiltersChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  showAdvancedFilters: boolean;

  constructor() {
    super();
  }

  get initialized(): boolean {
    return this.options != null && this.value != null;
  }

  onSchoolChange(): void {
    this.value = { school: this.value.school, name: this.value.name };
    this.schoolChange.emit(this.value.school);
  }

  onGroupChange(): void {
    this.value = { group: this.value.group, name: this.value.name };
    this.groupChange.emit(this.value.group);
  }

  onNameChange(): void {
    this.nameChange.emit(this.value.name);
  }

  onAdvancedFiltersToggleClick(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
    this.showAdvancedFiltersChange.emit(this.showAdvancedFilters);
  }

}
