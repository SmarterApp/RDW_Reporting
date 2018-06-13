import { Component, EventEmitter, forwardRef, Input, Output } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Utils } from "../../shared/support/support";


const NOOP: () => void = () => {};
const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Toggle),
  multi: true
};

/**
 * mirror of sb-toggle without angularitics and this one uses ngx-bootstrap button module.
 * moving sb-toggle to common-ngx will come later
 */
@Component({
  providers: [ CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR ],
  selector: 'toggle',
  template: `
    <div class="btn-group btn-group-xs toggle-group">
      <button *ngFor="let option of options"
         class="btn btn-primary"
         [(ngModel)]="value"
         [btnRadio]="option.value"
         [ngClass]="{disabled: disabled}">{{option.text}}</button>
    </div>
  `
})
export class Toggle implements ControlValueAccessor {

  @Input()
  disabled: boolean = false;

  @Output()
  click: EventEmitter<void> = new EventEmitter();

  private _options: Option[] = [];
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
    if (options.length != 2) {
      this.throwError('expected two options but got ' + options.length);
    }
    this._options = options.map(option => <Option>{
      value: option.value,
      text: option.text ? option.text : option.value
    });
    if (Utils.isUndefined(this._options[0].value)) {
      this._options[0].value = true;
    }
    if (Utils.isUndefined(this._options[1].value)) {
      this._options[1].value = false;
    }
  }

  get value(): any {
    return this._value;
  }

  @Input()
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

export interface Option {
  text: string;
  value: any;
}
