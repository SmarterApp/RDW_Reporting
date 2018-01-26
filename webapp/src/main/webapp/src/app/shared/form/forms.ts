import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";

/**
 * Holds common methods for dealing with angular form components
 */
export class Forms {

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
        holders.push({ id: errorId, properties: errors[errorId] });
      });
    });
    return holders;
  }

}

/**
 * Holds the form group error information
 */
export interface ValidationErrorHolder {
  id: string;
  properties?: {[key: string]: any};
}


