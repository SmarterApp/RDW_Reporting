import { AbstractControl, FormControl, FormGroup, NG_VALUE_ACCESSOR, ValidationErrors } from "@angular/forms";
import { forwardRef, ForwardRefFn } from "@angular/core";

/**
 * Holds common methods for dealing with angular form components
 */
export class Forms {

  /**
   * Provides the value accessor provider necessary for hooking {ControlValueAccessor}s into Angular rorms
   */
  public static valueAccessor(reference: any) {
    return {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => reference),
      multi: true
    }
  }

  /**
   * Gets all controls of the given form group
   *
   * @param {FormGroup} formGroup the form group to get the controls of
   * @returns {AbstractControl[]}
   */
  public static controls(formGroup: FormGroup): AbstractControl[] {
    return Object.values(formGroup.controls);
  }

  /**
   * Gets all of the validation errors from all form controls and wraps them in a {ValidationErrorHolder}
   *
   * @param {FormGroup} formGroup the form group to get the errors of
   * @returns {ValidationErrorHolder[]}
   */
  public static errors(formGroup: FormGroup): ValidationErrorHolder[] {
    const holders = [];
    Object.keys(formGroup.controls).forEach(key => {
      const errors: ValidationErrors = formGroup.get(key).errors || {};
      Object.keys(errors).forEach(errorId => {
        holders.push({ controlId: key, id: errorId, properties: errors[errorId] });
      });
    });
    return holders;
  }

  /**
   * True if the control has errors and has been touched or dirtied
   *
   * @param {AbstractControl} formControl the form control to test
   * @returns {boolean}
   */
  public static showErrors(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  public static submit(form: FormGroup, onValid: () => void, onInvalid?: () => void): void {
    if (form.valid) {
      onValid();
    } else {
      Forms.controls(form)
        .forEach(control => control.markAsDirty());
      form.updateValueAndValidity();

      if (typeof onInvalid === 'function') {
        onInvalid();
      }
    }
  }

}

/**
 * Holds the form group error information
 */
export interface ValidationErrorHolder {
  controlId: string;
  id: string;
  properties?: {[key: string]: any};
}


