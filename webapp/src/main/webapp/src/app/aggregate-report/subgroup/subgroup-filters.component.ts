import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubgroupFilters } from './subgroup-filters';
import { SubgroupFilterFormOptions } from './subgroup-filter-form-options';
import { ApplicationSettingsService } from '../../app-settings.service';

@Component({
  selector: 'subgroup-filters',
  templateUrl: './subgroup-filters.component.html'
})
export class SubgroupFiltersComponent {

  @Input()
  options: SubgroupFilterFormOptions;

  @Input()
  settings: SubgroupFilters;

  @Output()
  changed: EventEmitter<any> = new EventEmitter();

  appSettings: {elasEnabled: boolean, lepEnabled: boolean};

  constructor(private applicationSettingsService: ApplicationSettingsService) {
    applicationSettingsService.getSettings().subscribe(settings => this.appSettings = settings);
  }

  onSettingChangeInternal(): void {
    this.changed.emit();
  }

}
