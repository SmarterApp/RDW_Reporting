import { Component, Input, OnInit } from '@angular/core';
import { AbstractControlValueAccessor } from '../shared/form/abstract-control-value-accessor';
import { Utils } from '../shared/support/support';
import { Forms } from '../shared/form/forms';
import { Option } from '../shared/form/option';

const DefaultButtonGroupStyles = 'btn-group-sm';
const DefaultButtonStyles = 'btn-primary';

@Component({
  selector: 'wide-radio-group',
  templateUrl: './wide-radio-group.component.html',
  providers: [
    Forms.valueAccessor(WideRadioGroupComponent)
  ]
})
export class WideRadioGroupComponent extends AbstractControlValueAccessor<any[]> implements OnInit {

  @Input()
  public analyticsEvent: string;

  @Input()
  public analyticsCategory: string;

  @Input()
  public rowCount: number = 1;

  private _options: Option[];
  private _buttonGroupStyles: any = DefaultButtonGroupStyles;
  private _buttonStyles: any = DefaultButtonStyles;
  private _initialized = false;
  private _initialOptions: Option[];

  get gridStyles(): any {
    return {
      '-ms-grid-rows': 'auto '.repeat(this.rowCount).trim(),
      'grid-template-rows': 'repeat(' + (this.rowCount * 2) + ', auto)'
    };
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
      if (this._value !== value) {
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
    return options.map(option => {
        if (option.description) {
          return <Option>{
            value: option.value,
            text: option.text ? option.text : option.value,
            description: option.description,
            disabled: option.disabled,
            disabledText: option.disabledText,
            analyticsProperties: option.analyticsProperties
          };
        }
        return <Option>{
          value: option.value,
          text: option.text ? option.text : option.value,
          analyticsProperties: option.analyticsProperties
        };
      }
    );
  }


  private throwError(message: string): void {
    throw new Error(this.constructor.name + ' ' + message);
  }
}
