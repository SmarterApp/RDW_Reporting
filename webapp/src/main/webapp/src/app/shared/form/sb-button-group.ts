import { Component, Input, OnInit } from '@angular/core';
import { Forms } from './forms';
import { AbstractControlValueAccessor } from './abstract-control-value-accessor';
import * as _ from 'lodash';
import { Utils } from '../support/support';
import { Option } from './option';

/**
 * All input types that can be used to change the component click behavior
 */
export type InputType = 'checkbox' | 'range';

/**
 * Default component styles
 */
const DefaultButtonGroupStyles = 'btn-group-sm';
const DefaultButtonStyles = 'btn-primary';

/**
 * Holds the internal button selection state
 */
interface State {

  /**
   * True when the all option is selected
   */
  selectedAllOption: boolean;

  /**
   * Holds all selected option buttons
   */
  selectedOptions: Set<Option>;
}

/**
 * Contract for an input type controller.
 * This can be implemented to provide a new mode of behavior with the button group
 */
interface InputController {
  onButtonClick(context: SBButtonGroup, state: State, option: Option): void;
}

/**
 * Makes the button group behave as a checkbox group
 */
class Checkbox implements InputController {
  onButtonClick(context: SBButtonGroup, state: State, option: Option): void {
    const { selectedOptions } = state;
    if (selectedOptions.has(option)) {
      selectedOptions.delete(option);
    } else {
      selectedOptions.add(option);
    }
  }
}

/**
 * Makes the button group behave as a range selector
 */
class Range implements InputController {

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

  /**
   * Adds all unselected options between selected options to the provided selectedOptions set
   *
   * @param {Set<Option>} selectedOptions
   * @param {Option[]} options
   */
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

  /**
   * Clears all selected options except the provided option
   * if the provided option has selected options to both the left and right
   *
   * @param {Set<Option>} selectedOptions
   * @param {Option[]} options
   * @param {Option} option
   */
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

const ControllerByInputType: {[inpuType: string]: InputController} = {
  checkbox: new Checkbox(),
  range: new Range()
};

/**
 * A checkbox group to be used in place of a traditional multivalued <select> element
 */
@Component({
  selector: 'sb-button-group',
  template: `
    <ng-template #button let-option let-isAllOption="isAllOption">
      <label class="btn"
             [ngClass]="computeStylesInternal(buttonStyles, { 
                 active: isAllOption ? stateInternal.selectedAllOption : stateInternal.selectedOptions.has(option), 
                 disabled: option.disabled 
             })">
        <input type="checkbox"
               [attr.checked]="isAllOption ? stateInternal.selectedAllOption : stateInternal.selectedOptions.has(option)"
               [name]="name"
               [disabled]="option.disabled"
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
         class="toggle-group"
         [ngClass]="computeStylesInternal(buttonGroupStyles, {
           'vertical': vertical,
           'all-option': allOptionEnabled,
           'nested-btn-group': allOptionEnabled || vertical
         })">

      <ng-container *ngIf="allOptionEnabled">
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
  public allOptionEnabled: boolean = true;

  @Input()
  public noneStateEnabled: boolean = false;

  private _options: Option[];
  private _type: InputType;
  private _controller: InputController;
  private _state: State;
  private _initialized: boolean = false;
  private _initialOptions: Option[];
  private _initialValues: any[];
  private _allOptionReturnsUndefined: boolean = false; // TODO default should be true
  private _buttonGroupStyles: any = DefaultButtonGroupStyles;
  private _buttonStyles: any = DefaultButtonStyles;

  constructor() {
    super();
    this.type = 'checkbox';
  }

  ngOnInit(): void {
    this._options = this.parseInputOptions(this._initialOptions);
    this._value = this.parseInputValues(this._initialValues);
    this._state = this.computeState(this._options, this._value);
    this._initialized = true;
  }

  get type(): InputType {
    return this._type;
  }

  @Input()
  set type(value: InputType) {
    const controller = ControllerByInputType[value];
    if (controller == null) {
      this.throwError(`Unknown input type: "${value}"`);
    }
    this._type = value;
    this._controller = controller;
  }

  get options(): Option[] {
    return this._options;
  }

  @Input()
  set options(options: Option[]) {
    if (options.length) {
      if (this._initialized) {
        this._options = this.parseInputOptions(options);
        if (!this.effectiveNoneStateEnabled && (!this._value || this._value.length === 0)) {
          this._value = this.parseInputValues(this._initialValues);
        }
        if (!this.preserveAll()) {
          this._state = this.computeState(this._options, this._value);
        }
      } else {
        this._initialOptions = options;
      }
    }
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    if (this._initialized) {
      this.setValueAndNotifyChanges(this.parseInputValues(value));
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

  get allOptionReturnsUndefined(): boolean {
    return this._allOptionReturnsUndefined;
  }

  @Input()
  set allOptionReturnsUndefined(value: boolean) {
    this._allOptionReturnsUndefined = Utils.booleanValueOf(value);
  }

  get initializedInternal(): boolean {
    return this._initialized;
  }

  get stateInternal(): any {
    return this._state;
  }

  get effectiveNoneStateEnabled(): boolean {
    return this.noneStateEnabled || !this.allOptionEnabled;
  }

  /**
   * All button click handler
   */
  onAllOptionClickInternal(): void {

    const state = this._state,
      options = this._options;

    if (state.selectedAllOption) {
      if (this.effectiveNoneStateEnabled) {
        // If the all button is already selected,
        // and the component allows a no-value state
        // toggle the all button off
        state.selectedAllOption = false;
      }
    } else {
      // If the all button is not selected, select it
      state.selectedAllOption = true;
    }

    // Clicking the all button will always result
    // in a deselection of all options buttons
    state.selectedOptions.clear();

    this.updateValue(state, options);
  }

  /**
   * Option button click handler
   *
   * @param {Option} option
   */
  onOptionClickInternal(option: Option): void {

    const state = this._state,
      options = this._options;

    // Clicking an option button will always result
    // in a deselection of the all button
    state.selectedAllOption = false;

    // Delegate what should happen when an option is clicked to the state handler
    this._controller.onButtonClick(this, state, option);

    // If the component is made to have no selection but is set to not support a
    // no value state, make the component return to a selected all state
    if (state.selectedOptions.size === 0 && !this.effectiveNoneStateEnabled) {
      state.selectedAllOption = true;
    }

    this.updateValue(state, options);
  }

  computeStylesInternal(...styles): any {
    return Utils.toNgClass(...styles.filter(style => style != null));
  }

  /**
   * This method is called after a state change initiated through user input
   *
   * @param {State} state
   * @param {Option[]} options
   */
  private updateValue(state, options: Option[]): void {
    const values = state.selectedAllOption && this._allOptionReturnsUndefined
      ? undefined
      : options
        .filter(option => !option.disabled && (state.selectedAllOption || state.selectedOptions.has(option)))
        .map(option => option.value);

    this.setValueAndNotifyChanges(values);
  }

  /**
   * Normalizes, copies and makes options sensible defaults.
   * This should be used to process all options provided to the option field
   *
   * @param value
   * @returns {any[]}
   */
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
      analyticsProperties: option.analyticsProperties,
      disabled: option.disabled
    });
  }

  /**
   * Normalizes and copies values
   * This should be used to process all values provided to the value field
   *
   * @param values
   * @returns {any[]}
   */
  private parseInputValues(values: any): any[] {
    if (values == null) {
      // If the value is undefined and the component allows a no-value state, set value to empty
      if (this.effectiveNoneStateEnabled) {
        return [];
      }
      // If the component does not allow a no-value state, set the value to all enabled values
      return this.options
        .filter(option => !option.disabled)
        .map(option => option.value);
    }
    // Make a copy of the value to avoid side effects
    return values.concat();
  }

  /**
   * Initializes component state based on the component options and values
   * This method should be called after any externally initiated update to the component options or values
   *
   * @param {Option[]} options
   * @param {any[]} values
   * @returns {State}
   */
  private computeState(options: Option[], values: any[]): State {
    if (this.allOptionEnabled) {
      let enabledOptions = options.filter(x => !x.disabled);
      const effectiveOptions = enabledOptions.filter(option => values.includes(option.value));
      const effectivelySelectedAllOption = values.length === enabledOptions.length || enabledOptions.length === effectiveOptions.length;
      return {
        selectedAllOption: effectivelySelectedAllOption,
        selectedOptions: effectivelySelectedAllOption
          ? new Set()
          : new Set(effectiveOptions)
      };
    }
    return {
      selectedAllOption: false,
      selectedOptions: new Set(options.filter(option => values.includes(option.value)))
    };
  }

  private setValueAndNotifyChanges(value: any) {
    if (!_.isEqual(this._value, value)) {
      this._value = value;
      this._onChangeCallback(value);
    }
  }

  private throwError(message: string): void {
    throw new Error(`${this.constructor.name} ${message}`);
  }

  /**
   * If All was previously selected and the underlying options have changed
   * preserve the selection of All.
   */
  private preserveAll(): boolean {
    if (this._state && this._state.selectedAllOption) {
      this.setValueAndNotifyChanges(this.parseInputValues(null));
      return true;
    }
    return false;
  }

}
