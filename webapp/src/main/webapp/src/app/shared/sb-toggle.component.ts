import { Component, Input, OnInit } from "@angular/core";
import { Utils } from "./support/support";
import { AbstractControlValueAccessor } from "./form/abstract-control-value-accessor";
import { Forms } from "./form/forms";

const DefaultButtonGroupStyles = 'btn-group-sm';
const DefaultButtonStyles = 'btn-primary';

/**
 * @deprecated use <sb-radio-group>
 *
 * A two state switch component that can be used in place of a checkbox
 * @example <code><sb-radio-button-group [options]="[{value: true, text: 'On'}, {value: false, text: 'Off'}]" [(ngModel)]="myModel"></sb-radio-button-group></code>
 */
@Component({
  selector: 'sb-toggle,sb-radio-button-group',
  template: `
    <div class="btn-group toggle-group"
         [ngClass]="buttonGroupStyles"
         data-toggle="buttons">
      <label *ngFor="let option of options"
             class="btn"
             [ngClass]="computeStylesInternal(buttonStyles, {
                 active: option.value === value, 
                 disabled: disabled
             })">
        <input type="radio"
               id="{{name}}"
               name="{{name}}"
               [disabled]="disabled"
               [value]="option.value"
               [(ngModel)]="value"
               angulartics2On="click"
               angularticsEvent="{{analyticsEvent}}"
               angularticsCategory="{{analyticsCategory}}"
               [angularticsProperties]="option.analyticsProperties || {label: option.text}">{{option.text}}
      </label>
    </div>
  `,
  providers: [
    Forms.valueAccessor(SBToggleComponent)
  ]
})
export class SBToggleComponent extends AbstractControlValueAccessor<any> implements OnInit {

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
  private _buttonGroupStyles: any = DefaultButtonGroupStyles;
  private _buttonStyles: any = DefaultButtonStyles;

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

  ngOnInit() {
    if (this.options === undefined) {
      this.throwError('options must not be null');
    }
  }

  computeStylesInternal(...styles): any {
    return Utils.toNgClass(...styles);
  }

  private throwError(message: string): void {
    throw new Error(this.constructor.name + ' ' + message);
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
