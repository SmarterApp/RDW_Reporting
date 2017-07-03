import { OnInit, Component, Input, EventEmitter, Output } from "@angular/core";
import { StudentResultsFilterState } from "./model/student-results-filter-state.model";

@Component({
  selector: 'student-results-filter',
  templateUrl: './student-results-filter.component.html'
})
export class StudentResultsFilterComponent implements OnInit {

  @Input()
  filterState: StudentResultsFilterState = new StudentResultsFilterState();

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

  constructor() {
  }

  ngOnInit(): void {
    this.filterState.filterBy.onChanges.subscribe(() => this.onFilterChange());
  }

  /**
   * When a filter value is changed, emit a notification event.
   */
  public onFilterChange(): void {
    this.filterChange.emit();
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
