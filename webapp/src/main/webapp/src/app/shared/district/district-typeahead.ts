import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { District } from '../organization/organization';
import { AbstractControlValueAccessor } from '../form/abstract-control-value-accessor';
import { TypeaheadMatch } from 'ngx-bootstrap';

@Component({
  selector: 'district-typeahead',
  template: `
    <input
      class="form-control"
      id="{{ name }}"
      name="{{ name }}"
      [(ngModel)]="value"
      [disabled]="disabled"
      [typeahead]="options"
      [typeaheadItemTemplate]="districtTemplate"
      (typeaheadLoading)="loading = $event"
      (typeaheadNoResults)="noResults = $event"
      (typeaheadOnSelect)="onTypeaheadSelectInternal($event)"
      [typeaheadMinLength]="3"
      typeaheadOptionField="name"
      typeaheadWaitMs="300"
      placeholder="{{ placeholderText | translate }}"
    />

    <ng-template
      #districtTemplate
      let-district="item"
      let-index="index"
      let-query="query"
    >
      <p class="mb-0">{{ district.name }}</p>
    </ng-template>
  `
})
// tslint:disable-next-line:component-class-suffix
export class DistrictTypeahead extends AbstractControlValueAccessor<string> {
  @Input()
  options: Observable<District[]>;

  @Output()
  districtChange: EventEmitter<District> = new EventEmitter<District>();

  @Input()
  set district(district: District) {
    this._district = district;
    this._value = district ? district.name : undefined;
  }

  get district(): District {
    return this._district;
  }

  @Input()
  placeholderText = 'district-typeahead.placeholder';

  loading = false;
  noResults = false;
  private _district: District;

  onTypeaheadSelectInternal(event: TypeaheadMatch): void {
    this.district = event.item;
    this.districtChange.emit(event.item);
  }
}
