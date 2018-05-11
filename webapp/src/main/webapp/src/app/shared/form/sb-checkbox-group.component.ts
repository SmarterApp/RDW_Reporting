import { Component, Input, OnInit } from "@angular/core";
import { AbstractControlValueAccessor } from "./abstract-control-value-accessor";
import { Forms } from "./forms";
import { Utils } from "../support/support";


const DefaultButtonGroupStyles = 'btn-group-sm';
const DefaultButtonStyles = 'btn-primary';

/**
 * @deprecated use <sb-button-group type="checkbox">
 *
 * A checkbox group with an optional select all button for convenience
 *
 * Vertical Display:
 *
 * All | (Option 1)
 *     | ...
 *     | (Option N)
 *
 * Horizontal Display:
 *
 * All | (Option 1) ... (Option N)
 */
@Component({
  selector: 'sb-checkbox-group',
  template: `
    <div data-toggle="buttons"
         class="btn-group-sm toggle-group"
         [ngClass]="computeStylesInternal(buttonGroupStyles, {
           'vertical': !horizontal, 
           'all-option': allOptionEnabled,
           'nested-btn-group': allOptionEnabled || !horizontal
         })">
      <label *ngIf="allOptionEnabled"
             class="btn btn-primary"
             [ngClass]="computeStylesInternal(buttonStyles, { 
               active: selectedAllOptionInternal, 
               disabled: disabled
             })">
        <input type="checkbox"
               [name]="name"
               [disabled]="disabled"
               [(ngModel)]="selectedAllOptionInternal"
               (ngModelChange)="allOptionChangedInternal()"
               autocomplete="off"
               checked=""
               angulartics2On="click"
               angularticsEvent="{{analyticsEvent}}"
               angularticsCategory="{{analyticsCategory}}"
               [angularticsProperties]="allOptionAnalyticsProperties">
        {{'common.buttons.all' | translate}}
      </label>
      <div class="btn-group"
           [ngClass]="buttonGroupStyles">
        <label *ngFor="let option of options; let i = index"
               class="btn btn-primary"
               [ngClass]="computeStylesInternal(buttonStyles, { 
                   active: selectedOptionsInternal[ i ], 
                   disabled: disabled 
               })">
          <input type="checkbox"
                 [name]="name"
                 [disabled]="disabled"
                 [(ngModel)]="selectedOptionsInternal[ i ]"
                 (ngModelChange)="optionChangedInternal()"
                 autocomplete="off"
                 [attr.selected]="selectedOptionsInternal[ i ] ? 'true' : 'false'"
                 angulartics2On="click"
                 angularticsEvent="{{analyticsEvent}}"
                 angularticsCategory="{{analyticsCategory}}"
                 [angularticsProperties]="option.analyticsProperties">
          {{option.text}}
        </label>
      </div>
    </div>
  `,
  providers: [
    Forms.valueAccessor(SBCheckboxGroup)
  ]
})
export class SBCheckboxGroup extends AbstractControlValueAccessor<any[]> implements OnInit {

  @Input()
  public horizontal: boolean = false;

  @Input()
  public analyticsEvent: string;

  @Input()
  public analyticsCategory: string;

  @Input()
  public allOptionAnalyticsProperties: any = {};

  @Input()
  public allOptionEnabled: boolean = true;

  private _options: Option[];

  private _buttonGroupStyles: any = DefaultButtonGroupStyles;
  private _buttonStyles: any = DefaultButtonStyles;

  // internal properties necessarily made public for ng build --prod
  // these are also needed for (ngModelChange) to fire
  public selectedAllOptionInternal: boolean = true;
  public selectedOptionsInternal: boolean[] = [];

  get options(): Option[] {
    return this._options;
  }

  get buttonGroupStyles(): any {
    return this._buttonGroupStyles;
  }

  @Input()
  set buttonGroupStyles(value: any) {
    this._buttonGroupStyles = value ? value : DefaultButtonGroupStyles;
  }

  get buttonStyles(): any {
    return this._buttonStyles;
  }

  @Input()
  set buttonStyles(value: any) {
    this._buttonStyles = value ? value : DefaultButtonStyles;
  }

  @Input()
  set options(options: Option[]) {
    if (options == null || typeof options === 'undefined') {
      this.throwError('options must not be null or undefined');
    }
    this._options = options.map(option => <Option>{
      value: option.value,
      text: option.text ? option.text : option.value,
      analyticsProperties: option.analyticsProperties
    });
  }

  get value(): any[] {
    return this._value;
  }

  set value(value: any[]) {
    value = value || [];
    const valueMapper = option => value.indexOf(option.value) != -1;
    if (this.allOptionEnabled) {
      this.selectedAllOptionInternal = value.length === this.options.length;
      this.selectedOptionsInternal = this.selectedAllOptionInternal
        ? [] : this.options.map(valueMapper);
    } else {
      this.selectedOptionsInternal = this.options.map(valueMapper);
    }
    this.valueInternal = value;
  }

  private set valueInternal(value: any[]) {
    value = value || [];
    if (this._value !== value) {
      this._value = value;
      this._onChangeCallback(value);
    }
  }

  ngOnInit() {
    if (typeof this.options === 'undefined') {
      this.throwError('options must not be null or undefined');
    }
  }

  optionChangedInternal(): void {
    this.selectedAllOptionInternal = this.selectedOptionsInternal.every(selected => !selected);
    this.updateValue();
  }

  allOptionChangedInternal(): void {
    this.selectedAllOptionInternal = true;
    this.selectedOptionsInternal = [];
    this.updateValue();
  }

  computeStylesInternal(...styles): any {
    return Utils.toNgClass(...styles);
  }

  private updateValue(): void {
    const selectedOptions = this.allOptionEnabled && this.selectedAllOptionInternal
      ? this.options
      : this.options.filter((option, index) => this.selectedOptionsInternal[ index ]);
    this.valueInternal = selectedOptions.map(option => option.value);
  }

  private throwError(message: string): void {
    throw new Error(this.constructor.name + ' ' + message);
  }

}

/**
 * Describes what properties to give to the checkbox's options instances when initializing it.
 *
 * TODO share with sb-toggle
 */
export interface Option {
  value: any;
  text?: string;
  analyticsProperties?: any;
  disabled?: boolean;
}
