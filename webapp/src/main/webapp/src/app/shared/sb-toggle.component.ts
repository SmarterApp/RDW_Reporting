import { Component, forwardRef, OnInit, Input } from "@angular/core";
import { Utils } from "@sbac/rdw-reporting-common-ngx";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

const NOOP: () => void = () => {};

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SBToggleComponent),
  multi: true
};

/**
 * A two state switch component that can be used in place of a checkbox
 * @example <code><sb-toggle [options]="[{value: true, text: 'On'}, {value: false, text: 'Off'}]" [(ngModel)]="myModel"></sb-toggle></code>
 */
@Component({
  selector: 'sb-toggle',
  template: `
    <div class="btn-group btn-group-sm toggle-group" data-toggle="buttons">
      <label class="btn btn-primary" [ngClass]="{active: options[0].value === value, disabled: disabled}">
        <input type="radio" [name]="name" [disabled]="disabled" [value]="options[0].value" [(ngModel)]="value">{{options[0].text}}
      </label>
      <label class="btn btn-primary" [ngClass]="{'active': options[1].value === value, disabled: disabled}">
        <input type="radio" [name]="name" [disabled]="disabled" [value]="options[1].value" [(ngModel)]="value">{{options[1].text}}
      </label>
    </div>
  `,
  providers: [ CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR ]
})
export class SBToggleComponent implements ControlValueAccessor, OnInit {

  @Input()
  disabled: boolean = false;

  private _options: Option[];
  private _value: any;
  private _name: string = Utils.newGuid();
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
    if (options.length != 2) {
      this.throwError('expected two options but got ' + options.length);
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

  get name(): string {
    return this._name;
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
}
