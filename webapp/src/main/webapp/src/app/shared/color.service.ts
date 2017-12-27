import { Injectable } from "@angular/core";
import { Assessment } from "../assessments/model/assessment.model";
import { AssessmentType } from "./enum/assessment-type.enum";

/**
 * This service is responsible for transforming an arbitrary number
 * into a color value.
 */
@Injectable()
export class ColorService {

  private colors: string[] = [
    'teal',
    'green',
    'orange',
    'blue-dark',
    'maroon',
    'green-dark',
    'blue-dark'
  ];

  private performanceLevelColors: Map<AssessmentType, string[]> = new Map([
    [ AssessmentType.IAB, [ 'blue-dark', 'blue-dark aqua', 'aqua' ] ],
    [ AssessmentType.ICA, [ 'maroon', 'gray-darkest', 'green-dark', 'blue-dark' ] ],
    [ AssessmentType.SUMMATIVE, [ 'maroon', 'gray-darkest', 'green-dark', 'blue-dark' ] ]
  ]);

  /**
   * Retrieve the color for the given index.
   *
   * @param valueIndex an unbounded index
   */
  getColor(valueIndex: number): string {
    let idx: number = valueIndex % this.colors.length;
    return this.colors[ idx ];
  }

  /**
   * Retrieves the color for the performance level (0-based)
   *
   * @param {Assessment} assessment
   * @param {number} performanceLevel (0-based)
   * @returns {string} the class of the color
   */
  getPerformanceLevelColor(assessment: Assessment, performanceLevel: number): string {
    return this.performanceLevelColors.get(assessment.type)[performanceLevel];
  }
}
