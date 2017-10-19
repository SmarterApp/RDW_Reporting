import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'schoolYear'})
export class SchoolYearPipe implements PipeTransform {

  transform(value: number): string {
    let valString = value.toString();

    if(valString.length !== 4)
      return valString;

    return `${value - 1}-${valString.substring(2)}`;
  }
}
