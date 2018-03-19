export interface AssessmentDefinition {

  /**
   * Reflective reference to the type code of the assessment
   */
  readonly typeCode: string;

  /**
   * Whether or not the assessment is interim or not
   */
  readonly interim: boolean;

  /**
   * The total performance levels available for this assessment type.
   */
  readonly performanceLevels: number[];

  /**
   * The total performance levels available for this assessment type.
   */
  readonly performanceLevelCount: number;

  /**
   * The performance level grouping point.
   * Performance levels can be grouped into "below" and "at-or-above" the returned performance level.
   * A value of -1 denotes no rollup.
   */
  readonly performanceLevelGroupingCutPoint: number;

  /**
   * The identity columns to use in aggregate reports for the given assessment definition
   */
  readonly aggregateReportIdentityColumns: string[];

}
