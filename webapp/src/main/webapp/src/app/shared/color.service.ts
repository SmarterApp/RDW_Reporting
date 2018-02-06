import { Injectable } from "@angular/core";
import { Assessment } from "../assessments/model/assessment.model";
import { AssessmentType } from "./enum/assessment-type.enum";

const Colors: string[] = [
  'teal',
  'green',
  'orange',
  'blue-dark',
  'maroon',
  'green-dark',
  'blue-dark'
];

const Pallets: any[] = [
  [ 'blue-dark', 'blue-dark aqua', 'aqua' ],
  [ 'maroon', 'gray-darkest', 'green-dark', 'blue-dark' ],
  [ 'maroon', 'gray-darkest', 'green-dark', 'blue-dark' ],
];

const PerformanceLevelColorsByAssessmentType: Map<AssessmentType, string[]> = new Map([
  [ AssessmentType.IAB, Pallets[ 0 ] ],
  [ AssessmentType.ICA, Pallets[ 1 ] ],
  [ AssessmentType.SUMMATIVE, Pallets[ 2 ] ]
]);

const PerformanceLevelColorsByAssessmentTypeCode: Map<string, string[]> = new Map([
  [ 'iab', Pallets[ 0 ] ],
  [ 'ica', Pallets[ 1 ] ],
  [ 'sum', Pallets[ 2 ] ]
]);

/**
 * This service is responsible for transforming an arbitrary number
 * into a color value.
 */
@Injectable()
export class ColorService {

  /**
   * Retrieve the color for the given index.
   *
   * @param valueIndex an unbounded index
   */
  getColor(valueIndex: number): string {
    return Colors[ valueIndex % Colors.length ];
  }

  /**
   * Retrieves the color for the performance level (0-based)
   *
   * @param {Assessment} assessment
   * @param {number} performanceLevel (0-based)
   * @returns {string} the class of the color
   */
  getPerformanceLevelColor(assessment: Assessment, performanceLevel: number): string {
    return PerformanceLevelColorsByAssessmentType.get(assessment.type)[ performanceLevel ];
  }

  getPerformanceLevelColorsByAssessmentTypeCode(code: string, performanceLevel: number): string {
    return PerformanceLevelColorsByAssessmentTypeCode.get(code)[ performanceLevel - 1 ];
  }

}
