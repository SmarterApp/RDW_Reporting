import { Component, OnInit, Input } from '@angular/core';
import { FilterBy } from "../../model/filter-by.model";
import { ExamFilterOptions } from "../../model/exam-filter-options.model";

/*
  This component contains all of the selectable advanced filters
  for a group.
 */
@Component({
  selector: 'adv-filters',
  templateUrl: './adv-filters.component.html'
})
export class AdvFiltersComponent implements OnInit {
  private _filterBy: FilterBy;

  get filterBy(): FilterBy {
    return this._filterBy;
  }

  @Input()
  set filterBy(value: FilterBy) {
    this._filterBy = value;
  }

  @Input()
  filterOptions: ExamFilterOptions;

  constructor() {
  }

  ngOnInit() {
  }

  get translateRoot() {
    return "labels.groups.results.adv-filters.";
  }
}
