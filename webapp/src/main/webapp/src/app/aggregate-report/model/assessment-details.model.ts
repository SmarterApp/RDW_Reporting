/**
 * This model represents additional details about a given assessment.
 */
export interface AssessmentDetails {
  /**
   * The performance levels available for this assessment.
   */
  performanceLevels: number;

  /**
   * The performance level grouping point.
   * Performance levels can be grouped into "below" and "at-or-above" the returned
   * performance level.
   * A value of -1 denotes no rollup.
   */
  performanceGroupingCutpoint: number;
}
