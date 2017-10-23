import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'padStart'})
export class PadStartPipe implements PipeTransform {
  transform(value: string, maximumLength: number, fillString: string): string {
    if (value == null || maximumLength == null) {
      return value;
    }

    let result = String(value);
    let targetLength = typeof maximumLength === 'number'
      ? maximumLength
      : parseInt(maximumLength, 10);

    if (isNaN(targetLength) || !isFinite(targetLength)) {
      return result;
    }

    let length = result.length;
    if (length >= targetLength) {
      return result;
    }


    let fill = fillString == null ? '' : String(fillString);
    if (fill === '') {
      fill = ' ';
    }


    let fillLength = targetLength - length;

    while (fill.length < fillLength) {
      fill += fill;
    }

    var truncated = fill.length > fillLength ? fill.substr(0, fillLength) : fill;

    return truncated + result;
  }
}
