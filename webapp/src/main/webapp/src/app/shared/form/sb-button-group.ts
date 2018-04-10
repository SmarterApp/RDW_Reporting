import { Component, Input, OnInit } from '@angular/core';
import { Forms } from './forms';
import { AbstractControlValueAccessor } from './abstract-control-value-accessor';
import * as _ from 'lodash';
import { Utils } from '../support/support';

export type InputType = 'radio' | 'checkbox' | 'range';

export interface Option {
  readonly value: any;
  readonly text?: string;
  readonly analyticsProperties?: any;
}

const DefaultButtonGroupStyles = 'btn-group-sm';
const DefaultButtonStyles = 'btn-primary';

interface State {
  selectedAllOption: boolean;
  selectedOptions: Set<Option>;
}

interface InputTypeStateHandler {
  readonly multivalued: boolean;
  onButtonClick(context: SBButtonGroup, state: State, option: Option): void;
}

class Radio implements InputTypeStateHandler {

  get multivalued(): boolean {
    return false;
  }

  onButtonClick(context: SBButtonGroup, state: State, option: Option): void {
    const { selectedOptions } = state;
    selectedOptions.clear();
    selectedOptions.add(option);
  }

}

class Checkbox implements InputTypeStateHandler {

  get multivalued(): boolean {
    return true;
  }

  onButtonClick(context: SBButtonGroup, state: State, option: Option): void {
    const { selectedOptions } = state;
    if (selectedOptions.has(option)) {
      selectedOptions.delete(option);
    } else {
      selectedOptions.add(option);
    }
  }

}

class Range implements InputTypeStateHandler {

  get multivalued(): boolean {
    return true;
  }

  onButtonClick(context: SBButtonGroup, state: State, option: Option): void {
    const { selectedOptions } = state;
    if (selectedOptions.has(option)) {
      selectedOptions.delete(option);
      this.unfill(selectedOptions, context.options, option);
    } else {
      selectedOptions.add(option);
      this.fill(selectedOptions, context.options);
    }
  }

  private fill(selectedOptions: Set<Option>, options: Option[]): void {
    let firstIndex, lastIndex;
    options.forEach((option, index) => {
      if (selectedOptions.has(option)) {
        if (firstIndex == null) {
          firstIndex = index;
        }
        lastIndex = index;
      }
    });
    if (firstIndex != null && lastIndex != null && firstIndex !== lastIndex) {
      for (let i = firstIndex + 1; i < lastIndex; i++) {
        selectedOptions.add(options[i]);
      }
    }
  }

  private unfill(selectedOptions: Set<Option>, options: Option[], option: Option): void {
    const index = options.indexOf(option);
    const leftOptionSelected = options.slice(0, index).find(option => selectedOptions.has(option));
    const rightOptionSelected = options.slice(index + 1).find(option => selectedOptions.has(option));
    if (leftOptionSelected != null && rightOptionSelected != null) {
      selectedOptions.clear();
      selectedOptions.add(option);
    }
  }
}

const StateHandlerByInputType: {[inpuType: string]: InputTypeStateHandler} = {
  radio: new Radio(),
  checkbox: new Checkbox(),
  range: new Range()
};

@Component({
  selector: 'sb-button-group',
  template: `
    <ng-template #button let-option let-isAllOption="isAllOption">
      <label class="btn"
             [ngClass]="computeStylesInternal({ 
                 active: isAllOption ? stateInternal.selectedAllOption : stateInternal.selectedOptions.has(option), 
                 disabled: disabled 
             }, buttonStyles)">
        <input type="checkbox"
               [attr.checked]="isAllOption ? stateInternal.selectedAllOption : stateInternal.selectedOptions.has(option)"
               [name]="name"
               [disabled]="disabled"
               (click)="isAllOption ? onAllOptionClickInternal() : onOptionClickInternal(option)"
               angulartics2On="click"
               angularticsEvent="{{analyticsEvent}}"
               angularticsCategory="{{analyticsCategory}}"
               [angularticsProperties]="isAllOption ? allOptionAnalyticsProperties : option.analyticsProperties">
        {{option.text}}
      </label>
    </ng-template>

    <div *ngIf="initializedInternal"
         data-toggle="buttons"
         class="btn-group toggle-group"
         [ngClass]="buttonGroupStyles">

      <ng-container *ngIf="effectiveAllOptionEnabled">
        <ng-container *ngTemplateOutlet="button; context:{
          $implicit: { text: ('common.buttons.all' | translate) },
          isAllOption: true
        }"></ng-container>
      </ng-container>

      <div class="btn-group"
           [ngClass]="buttonGroupStyles">

        <ng-container *ngFor="let option of options">
          <ng-container *ngTemplateOutlet="button; context:{$implicit:option}"></ng-container>
        </ng-container>

      </div>
    </div>
  `,
  providers: [
    Forms.valueAccessor(SBButtonGroup)
  ]
})
export class SBButtonGroup extends AbstractControlValueAccessor<any[]> implements OnInit {

  @Input()
  public vertical: boolean = false;

  @Input()
  public analyticsEvent: string;

  @Input()
  public analyticsCategory: string;

  @Input()
  public allOptionAnalyticsProperties: any = {};

  @Input()
  public allOptionEnabled: boolean = false;

  @Input()
  public noneStateEnabled: boolean = false;

  @Input()
  public noneStateValue: any = [];

  private _options: Option[];
  private _type: InputType;
  private _stateHandler: InputTypeStateHandler;
  private _state: State;
  private _initialized: boolean = false;
  private _initialOptions: Option[];
  private _initialValues: any[];
  private _buttonGroupStyles: any = DefaultButtonGroupStyles;
  private _buttonStyles: any = DefaultButtonStyles;

  constructor() {
    super();
    this.type = 'radio';
  }

  ngOnInit(): void {
    this._options = this.parseInputOptions(this._initialOptions);
    this._value = this.parseInputValues(this._initialValues);
    this._state = this.computeState(this._options, this._value);
    this._initialized = true;
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

  get type(): InputType {
    return this._type;
  }

  @Input()
  set type(value: InputType) {
    if (this._initialized) {
      this.throwError(`Input type cannot be updated after initialization`);
    }
    const stateHandler = StateHandlerByInputType[value];
    if (stateHandler == null) {
      this.throwError(`Unknown input type: "${value}"`);
    }
    this._type = value;
    this._stateHandler = stateHandler;
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    if (this._initialized) {
      this.setValueAndNotifyChanges(value);
      this._state = this.computeState(this._options, this._value);
    } else {
      this._initialValues = value;
    }
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

  get initializedInternal(): boolean {
    return this._initialized;
  }

  get stateInternal(): any {
    return this._state;
  }

  get stateHandlerInternal(): InputTypeStateHandler {
    return this._stateHandler;
  }

  get effectiveAllOptionEnabled(): boolean {
    return this._stateHandler.multivalued && this.allOptionEnabled;
  }

  get effectiveNoneStateEnabled(): boolean {
    return this.noneStateEnabled || !this.allOptionEnabled;
  }

  onAllOptionClickInternal(): void {
    if (!this._stateHandler.multivalued || !this.allOptionEnabled) {
      return;
    }

    if (this._state.selectedAllOption) {
      if (this.effectiveNoneStateEnabled) {
        this._state.selectedAllOption = false;
      }
    } else {
      this._state.selectedAllOption = true;
    }

    this._state.selectedOptions.clear();
    this.updateValue();
  }

  onOptionClickInternal(option: Option): void {
    this._state.selectedAllOption = false;
    this._stateHandler.onButtonClick(this, this._state, option);

    if (this._state.selectedOptions.size === 0) {
      if (!this.effectiveNoneStateEnabled) {
        this._state.selectedAllOption = true;
      }
    }

    this.updateValue();
  }

  computeStylesInternal(...styles): any {
    return Utils.toNgClass(...styles.filter(style => style != null));
  }

  private updateValue(): void {
    const values = this.options
      .filter(option => this._state.selectedAllOption || this._state.selectedOptions.has(option))
      .map(option => option.value);

    this.setValueAndNotifyChanges(values.length > 0
      ? (this._stateHandler.multivalued ? values : values[0])
      : this.noneStateValue
    );
  }

  private parseInputOptions(options: Option[]): Option[] {
    if (options == null) {
      this.throwError('options must not be null or undefined');
    }
    if (options.length < 2) {
      this.throwError('at least two options are required');
    }
    return options.map(option => <Option>{
      value: option.value,
      text: option.text ? option.text : option.value,
      analyticsProperties: option.analyticsProperties
    });
  }

  private parseInputValues(value: any): any[] {
    if (this._stateHandler.multivalued) {
      if (value == null) {
        if (this.noneStateEnabled || !this.allOptionEnabled) {
          return this.noneStateValue;
        }
        return this.options.map(option => option.value);
      }
      return value.concat();
    }
    return value;
  }

  private computeState(options: Option[], value: any): State {
    const values = this._stateHandler.multivalued ? value : [ value ];
    if (this.effectiveAllOptionEnabled) {
      const effectivelySelectedAllOption = values.length === options.length;
      return {
        selectedAllOption: effectivelySelectedAllOption,
        selectedOptions: effectivelySelectedAllOption
          ? new Set()
          : new Set(
            options.filter(option => values.includes(option.value))
          )
      };
    }
    return {
      selectedAllOption: false,
      selectedOptions: new Set(
        options.filter(option => values.includes(option.value))
      )
    };
  }

  private setValueAndNotifyChanges(value: any) {
    if (this._stateHandler.multivalued ? !_.isEqual(this._value, value) : this._value !== value) {
      this._value = value;
      this._onChangeCallback(value);
    }
  }

  private throwError(message: string): void {
    throw new Error(`${this.constructor.name} ${message}`);
  }

}
