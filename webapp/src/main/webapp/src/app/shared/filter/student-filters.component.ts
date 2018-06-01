import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StudentFilterOptions } from './student-filter-options';
import { createDefaultStudentFilter, StudentFilter } from './student-filter';
import { StudentFilterFormOptions } from './student-filter-form-options';
import { StudentFilterFormOptionsMapper } from './student-filter-form-options.mapper';

@Component({
  selector: 'student-filters',
  templateUrl: './student-filters.component.html'
})
export class StudentFiltersComponent {

  @Input()
  showLimitedEnglishProficiencyFilter: boolean;

  @Input()
  showEnglishLanguageAcquisitionStatusFilter: boolean;

  @Output()
  changed: EventEmitter<StudentFilter> = new EventEmitter<StudentFilter>();

  private _options: StudentFilterOptions;
  private _formOptions: StudentFilterFormOptions;
  private _value: StudentFilter;

  constructor(private mapper: StudentFilterFormOptionsMapper) {
  }

  get value(): StudentFilter {
    return this._value;
  }

  get options(): StudentFilterOptions {
    return this._options;
  }

  @Input()
  set options(options: StudentFilterOptions) {
    this._options = options;
    this._formOptions = this.mapper.fromOptions(options);
    this._value = createDefaultStudentFilter(options);
  }

  get optionsInternal(): StudentFilterFormOptions {
    return this._formOptions;
  }

  onChange(): void {
    this.changed.emit(this._value);
  }

}
