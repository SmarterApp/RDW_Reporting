import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { School } from "./organization";
import { AbstractControlValueAccessor } from "../form/abstract-control-value-accessor";
import { TypeaheadMatch } from "ngx-bootstrap";

@Component({
  selector: 'school-typeahead',
  template: `
    <input class="form-control"
           id="{{name}}"
           name="{{name}}"
           [(ngModel)]="value"
           [disabled]="disabled"
           [typeahead]="options"
           [typeaheadItemTemplate]="schoolTemplate"
           (typeaheadLoading)="loading = $event"
           (typeaheadNoResults)="noResults = $event"
           (typeaheadOnSelect)="onTypeaheadSelectInternal($event)"
           [typeaheadMinLength]="3"
           typeaheadOptionField="name"
           typeaheadWaitMs="300"
           placeholder="{{'school-typeahead.placeholder' | translate}}">

    <ng-template #schoolTemplate let-school="item" let-index="index" let-query="query">
      <p class="mb-0">{{school.name}}</p>
      <p class="h6"><span class="label label-default">{{'school-typeahead.district-label' | translate}}</span>
        {{ school.districtName }}</p>
    </ng-template>
  `
})
export class SchoolTypeahead extends AbstractControlValueAccessor<string> {

  @Input()
  options: Observable<School[]> | School[];

  @Output()
  selected: EventEmitter<School> = new EventEmitter<School>();

  loading: boolean = false;
  noResults: boolean = false;

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    if (this._value !== value && value.length) {
      this._value = value;
      this._onChangeCallback(value);
    }
  }

  onTypeaheadSelectInternal(event: TypeaheadMatch): void {
    event.item && this.selected.emit(event.item);
  }

}
