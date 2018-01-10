import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'schoolYears' })
export class SchoolYearsPipe implements PipeTransform {

  transform(value: number[]): string[] {

    let valuesAsString: string[] = [];
    value.forEach(num => {
        let valueAsString = num.toString();

        if (valueAsString.length !== 4) {
          valuesAsString.push(valueAsString);
        } else {
          valuesAsString.push(`${num - 1}-${valueAsString.substring(2)}`);
        }
      }
    );
    return valuesAsString;

  }

}
