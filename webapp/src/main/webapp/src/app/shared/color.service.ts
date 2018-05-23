import { Injectable } from "@angular/core";

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
  [ 'iab-red', 'iab-yellow', 'iab-green' ],
  [ 'maroon', 'gray-darkest', 'green-dark', 'blue-dark' ],
  [ 'maroon', 'gray-darkest', 'green-dark', 'blue-dark' ],
];

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
   * Retrieves the color for the performance level (1-based)
   *
   * @param {string} assessment type (ica, iab, sum)
   * @param {number} performanceLevel (1-based)
   * @returns {string} the class of the color
   */
  getPerformanceLevelColorsByAssessmentTypeCode(code: string, performanceLevel: number): string {
    return PerformanceLevelColorsByAssessmentTypeCode.get(code)[ performanceLevel - 1 ];
  }

}
