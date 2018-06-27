import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Organization } from "./organization";
import { AbstractControlValueAccessor } from "../form/abstract-control-value-accessor";
import { TypeaheadMatch } from "ngx-bootstrap";

@Component({
  selector: 'organization-typeahead',
  template: `
    <input class="form-control"
           id="{{name}}"
           name="{{name}}"
           [(ngModel)]="value"
           [disabled]="disabled"
           [typeahead]="options"
           [typeaheadItemTemplate]="organizationTemplate"
           (typeaheadLoading)="loading = $event"
           (typeaheadNoResults)="noResults = $event"
           (typeaheadOnSelect)="onTypeaheadSelectInternal($event)"
           [typeaheadMinLength]="3"
           [typeaheadOptionsLimit]="100"
           [typeaheadOptionsInScrollableView]="20"
           [typeaheadScrollable]="true"
           typeaheadOptionField="name"
           typeaheadWaitMs="300"
           placeholder="{{'organization-typeahead.placeholder' | translate}}">
    
    <ng-template #organizationTemplate let-organization="item" let-index="index" let-query="query">
      <p class="mb-0">{{organization.name}}</p>
      <p class="h6"><span class="label label-default">{{'organization-typeahead.type-label' | translate}}</span> {{ ('common.organization.type.' + organization.type) | translate }}</p>
    </ng-template>
  `
})
export class OrganizationTypeahead extends AbstractControlValueAccessor<string> {

  @Input()
  options: Observable<Organization[]> | Organization[];

  @Output()
  selected: EventEmitter<Organization> = new EventEmitter<Organization>();

  loading: boolean = false;
  noResults: boolean = false;

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    if (this._value !== value) {
      this._value = value;
      this._onChangeCallback(value);
    }
  }

  onTypeaheadSelectInternal(event: TypeaheadMatch): void {
    event.item && this.selected.emit(event.item);
  }

}
