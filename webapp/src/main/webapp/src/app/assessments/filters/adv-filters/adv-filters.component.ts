import { Component, Input, OnInit } from "@angular/core";
import { FilterBy } from "../../model/filter-by.model";
import { ExamFilterOptions } from "../../model/exam-filter-options.model";
import { UserService } from "../../../user/user.service";

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

  @Input()
  showStudentFilter: boolean = true;

  showTransferAccess: boolean = false;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getCurrentUser()
      .toPromise()
      .then((user) => {
        this.showTransferAccess = user.configuration.transferAccess;
      });
  }

  get translateRoot() {
    return "labels.groups.results.adv-filters.";
  }
}
