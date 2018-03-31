import {Component, EventEmitter, Input, Output} from "@angular/core";
import {SubgroupFilters} from "./subgroup-filters";
import {SubgroupFilterFormOptions} from "./subgroup-filter-form-options";


@Component({
  selector: 'subgroup-filters',
  templateUrl: 'subgroup-filters.component.html'
})
export class SubgroupFiltersComponent {

  @Input()
  options: SubgroupFilterFormOptions;

  @Input()
  settings: SubgroupFilters;

  @Output()
  changed: EventEmitter<any> = new EventEmitter();

  constructor() {

  }

  onSettingChangeInternal(): void {
    this.changed.emit();
  }

}
