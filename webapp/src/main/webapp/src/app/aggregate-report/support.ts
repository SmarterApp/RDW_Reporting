/**
 * @param {number} endYear The year to start the list with
 * @param {string[]} gradeCodes The consecutive grade codes covered by the report
 * @returns {number[]} an array of years starting with the end year followed by the expected years corresponding to the grades
 */
export function computeEffectiveYears(endYear: number, gradeCodes: string[]): number[] {
  // This is not foolproof and assumes each grade code can be parsed into a numeric value
  return gradeCodes
    .map(code => Number.parseInt(code))
    .sort((a, b) => b - a)
    .map((grade, index, grades) => endYear - (grades[0] - grade));
}
