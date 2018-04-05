import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ordering } from "@kourge/ordering";
import { byString, join } from "@kourge/ordering/comparator";

/**
 * This typeahead decorates the ngx-bootstrap typeahead directive
 * giving it option grouping, and the behavior to show
 * available options when the input field is focused.
 */
@Component({
  selector: 'sb-typeahead,[sb-typeahead]',
  template: `
    <input class="form-control"
           id="{{inputId}}"
           [disabled]="disabledInternal"
           [typeahead]="options"
           [typeaheadMinLength]="0"
           typeaheadOptionField="label"
           typeaheadGroupField="group"
           (typeaheadOnSelect)="onSelectInternal($event.item)"
           (ngModelChange)="onChangeInternal()"
           [(ngModel)]="search"
           placeholder="{{placeholder}}"
           [typeaheadOptionsLimit]="100"
           [typeaheadOptionsInScrollableView]="20"
           [typeaheadScrollable]="true"
           autocomplete="off">
  `
})
export class SBTypeahead implements OnInit {

  /**
   * Emits the value when the value changes.
   * This is different than select in that it will emit when the value changes programmatically.
   */
  @Output()
  change: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emits an option's value when an option is selected.
   * This is different than change in that it will only emit when a user selects the value.
   */
  @Output()
  select: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  placeholder: string = '';

  @Input()
  disabled: boolean = false;

  @Input()
  search: string;

  @Input()
  inputId: string;

  private _options: Option[] = [];

  private _value: any;

  ngOnInit(): void {
    this.search = this.getSearchFromValue(this.value);
  }

  get options(): Option[] {
    return this._options;
  }

  @Input()
  set options(options: Option[]) {
    if (this._options !== options) {
      this._options = options
        ? options
          .sort(
            join(
              ordering(byString).on<Option>(o => o.group === undefined ? '' : o.group).compare,
              ordering(byString).on<Option>(o => o.label).compare
            ))
        : [];
    }
  }

  get value(): any {
    return this._value;
  }

  @Input()
  set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      this.change.emit(value);
    }
  }

  get disabledInternal(): boolean {
    return this.disabled || this.options.length == 0;
  }

  onSelectInternal(option: Option): void {
    this.value = option.value;
    this.select.emit(option.value);
  }

  onChangeInternal(): void {
    this.value = undefined;
  }

  private getSearchFromValue(value: any): string {
    if (value) {
      let option = this.options.find(option => option.value === value);
      if (option) {
        return option.label;
      }
    }
    return '';
  }

}

export interface Option {
  label: string;
  value: any;
  group: string;
}
