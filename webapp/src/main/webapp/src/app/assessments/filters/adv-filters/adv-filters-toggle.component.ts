import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { FilterBy } from "../../model/filter-by.model";
import { ExamFilterService } from "../exam-filters/exam-filter.service";

/**
 * This component displays the toggle-able currently-applied advanced filters.
 */
@Component({
  selector: 'adv-filters-toggle',
  templateUrl: './adv-filters-toggle.component.html'
})
export class AdvFiltersToggleComponent implements OnInit {

  @Input()
  public displayOptions: any = {};

  @Input()
  public filterBy: FilterBy = new FilterBy();

  @Output()
  public removed: EventEmitter<string> = new EventEmitter();

  filters: any = {};

  constructor(private examFilterService: ExamFilterService) {}

  ngOnInit(): void {
    this.examFilterService.getFilterDefinitions().forEach(filter => {
      this.filters[ filter.name ] = filter;
    });
  }

}
