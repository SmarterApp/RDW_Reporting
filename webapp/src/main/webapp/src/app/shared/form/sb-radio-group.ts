import { Component, Input, OnInit } from '@angular/core';
import { AbstractControlValueAccessor } from './abstract-control-value-accessor';
import { Forms } from './forms';
import { Option } from './option';
import { Utils } from '../support/support';

const DefaultButtonGroupStyles = 'btn-group-sm';
const DefaultButtonStyles = 'btn-primary';

/**
 * Radio button group to be used in place of a single valued <select> element
 */
@Component({
  selector: 'sb-radio-group',
  template: `
    <div
      class="btn-group toggle-group"
      [ngClass]="buttonGroupStyles"
      data-toggle="buttons"
    >
      <ng-container *ngFor="let option of options">
        <label
          class="btn"
          *ngIf="!option.hidden"
          [ngClass]="
            computeStylesInternal(buttonStyles, {
              active: property
                ? option.value[property] === value
                : option.value === value,
              disabled: option.disabled
            })
          "
        >
          <input
            type="radio"
            id="{{ name }}"
            name="{{ name }}"
            [attr.selected]="
              property
                ? option.value[property] === value
                : option.value === value
            "
            [disabled]="option.disabled"
            [value]="option.value"
            [(ngModel)]="value"
            angulartics2On="click"
            angularticsAction="{{ analyticsEvent }}"
            angularticsCategory="{{ analyticsCategory }}"
            [angularticsProperties]="option.analyticsProperties"
          />
          {{ option.text }}
        </label>
      </ng-container>
    </div>
  `,
  providers: [Forms.valueAccessor(SBRadioGroup)]
})
export class SBRadioGroup extends AbstractControlValueAccessor<any>
  implements OnInit {
  @Input()
  public analyticsEvent: string;

  @Input()
  public analyticsCategory: string;

  @Input()
  public property: string;

  private _options: Option[];
  private _buttonGroupStyles: any = DefaultButtonGroupStyles;
  private _buttonStyles: any = DefaultButtonStyles;
  private _initialized: boolean = false;
  private _initialOptions: Option[];

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
    if (this._initialized) {
      this._options = this.parseInputOptions(options);
    } else {
      this._initialOptions = options;
    }
  }

  get value(): any {
    return this._value;
  }

  @Input()
  set value(value: any) {
    if (this._initialized) {
      if (this.property && this._value !== value && typeof value == 'object') {
        this._value = value ? value[this.property] : null;
        this._onChangeCallback(value ? value[this.property] : null);
      } else if (this._value !== value) {
        this._value = value;
        this._onChangeCallback(value);
      }
    } else {
      this._value = value;
    }
  }

  ngOnInit() {
    this._options = this.parseInputOptions(this._initialOptions);
    this._initialized = true;
  }

  computeStylesInternal(...styles): any {
    return Utils.toNgClass(...styles);
  }

  private parseInputOptions(options: Option[]): Option[] {
    if (options == null) {
      this.throwError('options must not be null or undefined');
    }
    if (options.length < 2) {
      this.throwError('at least two options are required');
    }
    return options.map(
      option =>
        <Option>{
          value: option.value,
          text: option.text ? option.text : option.value,
          analyticsProperties: option.analyticsProperties,
          disabled: option.disabled,
          hidden: option.hidden
        }
    );
  }

  private throwError(message: string): void {
    throw new Error(this.constructor.name + ' ' + message);
  }
}
