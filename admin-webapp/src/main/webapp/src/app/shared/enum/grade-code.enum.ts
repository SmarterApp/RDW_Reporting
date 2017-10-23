/**
 * This utility class contains an ordered list of available
 * grade code values.
 */
export class GradeCode {

  private static codes: string[] = [
    'KG',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    'PS',
    'UG',
    'IT',
    'PR',
    'PK',
    'TK'
  ];

  /**
   * Retrieve the index for the given grade code.
   * Unknown grade codes will be given an index of 0.
   *
   * @param code  The grade code
   * @returns {number} The ordered index of the grade code
   */
  public static getIndex(code: string): number {
    let idx: number = this.codes.indexOf(code);
    return idx >= 0 ? idx : 0;
  }
}
