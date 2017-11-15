import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'schoolYear' })
export class SchoolYearPipe implements PipeTransform {

  transform(value: number): string {
    let valueAsString = value.toString();

    if (valueAsString.length !== 4) {
      return valueAsString;
    }

    return `${value - 1}-${valueAsString.substring(2)}`;
  }

}
