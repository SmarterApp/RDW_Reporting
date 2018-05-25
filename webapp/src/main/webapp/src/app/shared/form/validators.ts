import { ValidatorFn } from '@angular/forms';
import { computeEffectiveYears } from '../../aggregate-report/support';

/**
 * Form control validator that makes sure the control value is not an empty array
 *
 * @param properties the properties to propagate when the control value is invalid
 * @return {ValidatorFn}
 */
export function notEmpty(properties: any): ValidatorFn {
  return control => {
    return control.value.length ? null : { notEmpty: properties };
  };
}

export function withinBounds(toSchoolYear: number,
                             assessmentGrades: string[],
                             lowestAvailableSchoolYear: number,
                             properties: any): ValidatorFn {
  return control => {
    const effectiveSchoolYears = computeEffectiveYears(toSchoolYear, assessmentGrades);
    if (lowestAvailableSchoolYear > Math.min(...effectiveSchoolYears)) {
      return { withinBounds: properties };
    }
    return null;
  };
}

/**
 * Form control validator that makes sure the control value is a valid filename
 *
 * @param properties the properties to propagate when the control value is invalid
 * @return {ValidatorFn}
 */
export function fileName(properties: any): ValidatorFn {
  return control => {
    return /^[^\\<>:;,?"*|/]*$/.test((control.value || '').trim()) ? null : { fileName: properties };
  };
}
