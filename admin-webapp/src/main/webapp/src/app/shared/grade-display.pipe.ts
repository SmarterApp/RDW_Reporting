import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { isNullOrUndefined } from "util";
import { Observable } from "rxjs";

/**
 * This pipe is responsible for transforming a grade codes into a
 * translated display value.
 */
@Pipe({
  name: 'gradeDisplay',
  //impure because we want to re-translate on language selection
  pure: false
})
export class GradeDisplayPipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  /**
   * Method to transform a grade code to a desired display value.
   * @param gradeCode
   * @param format
   * @returns transformed grade
   */
  transform(gradeCode: string, format: string): Observable<string> {
    if (isNullOrUndefined(format)) {
      format = "short-name";
    }

    return this.translate.instant(`labels.grades.${gradeCode}.${format}`);
  }
}
