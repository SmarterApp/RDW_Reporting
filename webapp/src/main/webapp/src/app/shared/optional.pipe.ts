import { Pipe, PipeTransform } from "@angular/core";

/**
 * This pipe is used when an optional value is missing and we want to display a missing value like "-" which is the default.
 */
@Pipe({ name: 'optional'})
export class OptionalPipe implements PipeTransform {
  /**
   * Determines what value should be displayed based on if the value parameter is null
   * @param value the value that is checked to see if it is missing
   * @param displayValue if provided, display this value instead of value when it is not null
   * @param missingValue if value is missing, then display this value or the default '-' if this is not provided
   * @returns {any}
   */
  transform(value: any, displayValue: any, missingValue: any = '-') {
    if (value == null) return missingValue;

    return displayValue == null ? value : displayValue;
  }
}
