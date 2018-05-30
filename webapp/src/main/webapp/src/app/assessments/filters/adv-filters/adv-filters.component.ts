import { Component, Input } from '@angular/core';
import { FilterBy } from '../../model/filter-by.model';
import { ExamFilterOptions } from '../../model/exam-filter-options.model';
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
  showStudentFilter = true;

  showTransferAccess = false;
  showElas = false;
  showLep = false;

  constructor(private applicationSettingsService: ApplicationSettingsService) {
    applicationSettingsService.getSettings().subscribe(settings => {
      this.showTransferAccess = settings.transferAccess;
      this.showElas = settings.elasEnabled;
      this.showLep = settings.lepEnabled;
    });
  }

}
