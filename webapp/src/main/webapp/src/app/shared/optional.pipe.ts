import {Pipe, PipeTransform} from "@angular/core";

@Pipe({ name: 'optional'})
export class OptionalPipe implements PipeTransform {
  defaultMissingValue: string = '-';

  transform(value: any, displayValue: any, missingValue: any) {
    if (missingValue == null) missingValue = this.defaultMissingValue;

    if (value === null) return missingValue;

    return displayValue == null ? value : displayValue;
  }
}
