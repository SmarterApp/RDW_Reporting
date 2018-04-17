import { ControlValueAccessor } from "@angular/forms";
import { Input } from "@angular/core";
import { Utils } from "../support/support";

const NoOperation: () => void = () => {};

/**
 * Abstract class made to hide away the complexity of integrating with angular form control interface
 */
export abstract class AbstractControlValueAccessor<T> implements ControlValueAccessor {

  protected _name: string = Utils.newGuid();
  protected _disabled: boolean = false;
  protected _onTouchedCallback: () => void = NoOperation;
  protected _onChangeCallback: (value: any) => void = NoOperation;
  protected _value: T;

  public get name(): string {
    return this._name;
  }

  @Input()
  public set name(value: string) {
    this._name = value;
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
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
    this._onChangeCallback = (Utils.isUndefined(callback) ? NoOperation : callback);
  }

  /**
   * @override
   * @inheritDoc
   */
  registerOnTouched(callback: any): void {
    this._onTouchedCallback = (Utils.isUndefined(callback) ? NoOperation : callback);
  }

  /**
   * @override
   * @inheritDoc
   */
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  /**
   * Implementation can override this method and provide the form control value
   *
   * @returns {T} the value of the form control
   */
  get value(): T {
    return this._value;
  }

  /**
   * Implementation can override this method to set the form control value
   */
  set value(value: T) {
    if (this._value !== value) {
      this._value = value;
      this._onChangeCallback(value);
    }
  }

}
