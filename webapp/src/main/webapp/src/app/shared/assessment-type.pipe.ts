import { Pipe, PipeTransform } from "@angular/core";
import { AssessmentType } from "./enum/assessment-type.enum";

/**
 * This pipe is responsible for transforming an AssessmentType enum
 * into display values.
 * Default pipe displays human-readable text.
 * 'color' argument displays associated assessment type color.
 */
@Pipe({name: 'assessmentType'})
export class AssessmentTypePipe implements PipeTransform {

  private colorMap: Map<AssessmentType, string> = new Map();

  constructor() {
    this.colorMap.set(AssessmentType.IAB, 'green-dark');
    this.colorMap.set(AssessmentType.ICA, 'maroon');
    this.colorMap.set(AssessmentType.SUMMATIVE, 'blue');
  }

  transform(assessmentType: AssessmentType, format: string): string {

    if (format == 'color') {
      return this.colorMap.get(assessmentType);
    }

    return AssessmentType[ assessmentType ];
  }
}
