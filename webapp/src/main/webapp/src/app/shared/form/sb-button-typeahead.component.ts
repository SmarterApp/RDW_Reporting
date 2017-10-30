import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SBTypeahead } from "./sb-typeahead.component";
import { isUndefined } from "util";

/**
 * This component adds a button on the right hand side of the sb-typeahead.
 * If clicked when the an option is selected in the sb-typeahead,
 * it will emit a buttonClick event with the option value and clear the selected option.
 * The purpose of the button is to provide an intuitive way to take action with the given selection.
 */
@Component({
  selector: 'sb-button-typeahead,[sb-button-typeahead]',
  template: `
    <span class="input-group">
      <input class="form-control"
             [id]="inputId"
             [disabled]="disabledInternal"
             [typeahead]="options"
             [typeaheadMinLength]="0"
             typeaheadOptionField="label"
             typeaheadGroupField="group"
             (typeaheadOnSelect)="onSelectInternal($event.item)"
             (ngModelChange)="onChangeInternal()"
             [(ngModel)]="search"
             [placeholder]="placeholder">
      
      <span class="input-group-btn">
        <button type="button"
                class="btn btn-default"
                (click)="onButtonClickInternal()"
                [disabled]="buttonDisabledInternal"><span [ngClass]="{'gray': buttonDisabledInternal}"><i class="fa fa-plus"></i> {{buttonLabel}}</span>
        </button>
      </span>
    </span>
  `
})
export class SBButtonTypeahead extends SBTypeahead {

  @Output()
  buttonClick: EventEmitter<any> = new EventEmitter();

  @Input()
  buttonLabel: string = '';

  get buttonDisabledInternal(): boolean {
    return this.disabledInternal || isUndefined(this.value);
  }

  onButtonClickInternal(): void {
    if (!isUndefined(this.value)) {
      this.buttonClick.emit(this.value);
      this.search = '';
    }
  }

}
