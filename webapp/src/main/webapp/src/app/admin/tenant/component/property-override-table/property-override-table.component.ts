import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { ConfigurationProperty, Property } from '../../model/property';
import {
  fieldInputType,
  fieldValidators,
  isModified
} from '../../model/fields';

export function localizationsFormGroup(
  defaults: any,
  overrides: any = {}
): FormGroup {
  overrides = overrides || {};
  return new FormGroup(
    Object.keys(defaults).reduce((controlsByName, key) => {
      // don't populate form control values for inputs
      // show a placeholder instead to indicate that entering nothing will
      // result in that default value
      const value =
        fieldInputType(key) !== 'input'
          ? overrides[key] || defaults[key]
          : overrides[key];

      controlsByName[key] = new FormControl(value, fieldValidators(key));
      return controlsByName;
    }, {})
  );
}

function rowTrackBy(index: number, value: Property) {
  return value.key;
}

@Component({
  selector: 'property-override-table',
  templateUrl: './property-override-table.component.html',
  styleUrls: ['./property-override-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PropertyOverrideTableComponent),
      multi: true
    }
  ]
})
export class PropertyOverrideTableComponent implements ControlValueAccessor {
  readonly rowTrackBy = rowTrackBy;

  @Input()
  defaults: any;

  @Input()
  readonly = true;

  _rows: Property[];
  _first = 0;

  constructor(public controlContainer: ControlContainer) {}

  @Input()
  set rows(values: Property[]) {
    this._rows = values;
    // reset the page back to the first page when the search changes
    this._first = 0;
  }

  modified(property: ConfigurationProperty): boolean {
    return isModified(
      property.key,
      this.formGroup.value[property.key],
      property.originalValue
    );
  }

  get formGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  // control value accessor implementation:

  public onTouched: () => void = () => {};

  writeValue(value: any): void {
    if (value) {
      this.formGroup.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.formGroup.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.formGroup.disable() : this.formGroup.enable();
  }

  // internals

  onResetButtonClick(property: Property): void {
    this.formGroup.patchValue({
      [property.key]: property.originalValue
    });
  }
}
