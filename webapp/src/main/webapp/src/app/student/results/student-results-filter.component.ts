import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StudentResultsFilterState } from './model/student-results-filter-state.model';
import { Angulartics2 } from 'angulartics2';
import { ExamFilterOptions } from '../../assessments/model/exam-filter-options.model';
import { FilterBy } from '../../assessments/model/filter-by.model';

@Component({
  selector: 'student-results-filter',
  templateUrl: './student-results-filter.component.html'
})
export class StudentResultsFilterComponent {

  @Input()
  filterState: StudentResultsFilterState = { schoolYears: [], subjects: [], assessmentTypes: [] };

  @Input()
  filterOptions: ExamFilterOptions = new ExamFilterOptions();

  @Output()
  filterChange: EventEmitter<any> = new EventEmitter();

  filterDisplayOptions: any = {
    expanded: true
  };

  @Input()
  advancedFilters: FilterBy = new FilterBy();

  private _showAdvancedFilters: boolean;

  constructor(private angulartics2: Angulartics2) {
  }

  set showAdvancedFilters(value: boolean) {
    this._showAdvancedFilters = value;
    this.filterDisplayOptions.expanded = value;
  }

  get showAdvancedFilters(): boolean {
    return this._showAdvancedFilters;
  }

  /**
   * When a filter value is changed, emit a notification event.
   */
  public onFilterChange(changedProperty: string): void {
    this.filterChange.emit(changedProperty);

    // track change event since wiring select boxes on change as HTML attribute is not possible
    this.angulartics2.eventTrack.next({
      action: 'Change' + changedProperty,
      properties: {
        category: 'StudentHistoryAdvancedFilters',
        label: changedProperty
      }
    });
  }

  public removeFilter(property: string) {
    if (property === 'offGradeAssessment') {
      this.advancedFilters[ property ] = false;
    } else {
      this.advancedFilters[ property ] = -1;
    }
  }

  openAndScrollToAdvancedFilters() {
    this.showAdvancedFilters = true;
    setTimeout(() => {
      document.getElementById('results-adv-filters').scrollIntoView();
    }, 0);
  }

}
