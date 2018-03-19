import { Component, Input } from "@angular/core";
import { FilterBy } from "../../model/filter-by.model";
import { ExamFilterOptions } from "../../model/exam-filter-options.model";
import { ActivatedRoute } from '@angular/router';
import { ApplicationSettingsService } from '../../../app-settings.service';

/*
  This component contains all of the selectable advanced filters
  for a group.
 */
@Component({
  selector: 'adv-filters',
  templateUrl: './adv-filters.component.html'
})
export class AdvFiltersComponent {

  @Input()
  filterOptions: ExamFilterOptions;

  @Input()
  filterBy: FilterBy;

  @Input()
  showStudentFilter: boolean = true;

  showTransferAccess: boolean = false;

  constructor(private applicationSettingsService: ApplicationSettingsService) {
    applicationSettingsService.getSettings().subscribe(settings => {
      this.showTransferAccess = settings.transferAccess;
    })
  }

}
