import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Utils } from "./support/support";

const NOOP: () => void = () => {
};

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SBToggleComponent),
  multi: true
};

/**
 * TODO rename to sb-radio-button-group
 *
 * A two state switch component that can be used in place of a checkbox
 * @example <code><sb-toggle [options]="[{value: true, text: 'On'}, {value: false, text: 'Off'}]" [(ngModel)]="myModel"></sb-toggle></code>
 */
@Component({
  selector: 'sb-toggle',
  template: `
    <div class="btn-group btn-group-sm toggle-group"
         data-toggle="buttons">
      <label *ngFor="let option of options"
             class="btn btn-primary"
             [ngClass]="{active: option.value === value, disabled: disabled}">
        <input type="radio"
               [id]="name"
               [name]="name"
               [disabled]="disabled"
               [value]="option.value"
               [(ngModel)]="value"
               angulartics2On="click"
               [angularticsEvent]="analyticsEvent"
               [angularticsCategory]="analyticsCategory"
               [angularticsProperties]="option.analyticsProperties || {label: option.text}">{{option.text}}
      </label>
    </div>
  `,
  providers: [ CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR ]
})
export class SBToggleComponent implements ControlValueAccessor, OnInit {

  @Input()
  disabled: boolean = false;

  @Input()
  name: string = Utils.newGuid();

  /**
   *  The analytics event to send when clicked
   */
  @Input()
  public analyticsEvent: string;

  /**
   * The analytics category to use
   */
  @Input()
  public analyticsCategory: string;

  private _options: Option[];
  private _value: any;
  private _onTouchedCallback: () => void = NOOP;
  private _onChangeCallback: (_: any) => void = NOOP;

  get options(): Option[] {
    return this._options;
  }

  @Input()
  set options(options: Option[]) {
    if (options == null || typeof options === 'undefined') {
      this.throwError('options must not be null or undefined');
    }
    this._options = options.map(option => <Option>{
      value: option.value,
      text: option.text ? option.text : option.value
    });
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      this._onChangeCallback(value);
    }
  }

  ngOnInit() {
    if (this.options === undefined) {
      this.throwError('options must not be null');
    }
  }

  private throwError(message: string): void {
    throw new Error(this.constructor.name + ' ' + message);
  }

  /**
   * @override
   * @inheritDoc
   */
  writeValue(value: any): void {
    this.value = value;
  }

  /**
   * @override
   * @inheritDoc
   */
  registerOnChange(callback: any): void {
    this._onChangeCallback = (callback !== null ? callback : NOOP);
  }

  /**
   * @override
   * @inheritDoc
   */
  registerOnTouched(callback: any): void {
    this._onTouchedCallback = (callback !== null ? callback : NOOP);
  }

}

/**
 * Describes what properties to give to the toggle's options instances when initializing it.
 */
export interface Option {
  value: any;
  text?: string;
  analyticsProperties?: any;
}
