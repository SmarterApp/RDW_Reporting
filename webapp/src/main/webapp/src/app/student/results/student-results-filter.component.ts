import { OnInit, Component, Input, EventEmitter, Output } from "@angular/core";
import { StudentResultsFilterState } from "./model/student-results-filter-state.model";
import { Angulartics2 } from 'angulartics2';
import { ExamFilterOptions } from "../../assessments/model/exam-filter-options.model";

@Component({
  selector: 'student-results-filter',
  templateUrl: './student-results-filter.component.html'
})
export class StudentResultsFilterComponent implements OnInit {

  @Input()
  filterState: StudentResultsFilterState = new StudentResultsFilterState();

  @Input()
  filterOptions: ExamFilterOptions = new ExamFilterOptions();

  @Output()
  filterChange: EventEmitter<any> = new EventEmitter();

  filterDisplayOptions: any = {
    expanded: true
  };

  set showAdvancedFilters(value: boolean) {
    this._showAdvancedFilters = value;
    this.filterDisplayOptions.expanded = value;
  }

  get showAdvancedFilters(): boolean {
    return this._showAdvancedFilters;
  }

  private _showAdvancedFilters: boolean;

  constructor(private angulartics2: Angulartics2) {
  }

  ngOnInit(): void {
    this.filterState.filterBy.onChanges.subscribe(() => this.onFilterChange(''));
  }

  /**
   * When a filter value is changed, emit a notification event.
   */
  public onFilterChange(changeSource: string): void {
    this.filterChange.emit();

    // track change event since wiring select boxes on change as HTML attribute is not possible
    this.angulartics2.eventTrack.next({
      action: 'Change' + changeSource,
      properties: {
        category: 'StudentHistoryAdvancedFilters',
        label: changeSource === 'Subject' ? this.filterState.subject : this.filterState.schoolYear
      }
    });
  }

  public removeFilter(property: string) {
    if (property == 'offGradeAssessment') {
      this.filterState.filterBy[ property ] = false;
    }
    else {
      this.filterState.filterBy[ property ] = -1;
    }
  }
}
