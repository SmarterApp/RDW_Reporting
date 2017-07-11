import { Pipe, PipeTransform } from "@angular/core";
import { AssessmentType } from "./enum/assessment-type.enum";

/**
 * This pipe is responsible for transforming an AssessmentType enum
 * into display values.
 */
@Pipe({name: 'assessmentType'})
export class AssessmentTypePipe implements PipeTransform {

  transform(assessmentType: AssessmentType, format: string): string {
    return AssessmentType[ assessmentType ];
  }
}
