import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

const MATH = "MATH";
const ELA = "ELA";

@Pipe({name: 'subject'})
export class SubjectPipe implements PipeTransform {
  private math: string;
  private ela: string;
  private all: string;

  constructor(private translate: TranslateService){
    this.math = translate.instant("enum.subject.MATH");
    this.ela = translate.instant("enum.subject.ELA");
    this.all = `${this.math}, ${this.ela}`
  }

  transform(value: string): string {
    if(value == MATH) {
      return this.math;
    }
    else if(value == ELA) {
      return this.ela;
    }

    return this.all;
  }
}
