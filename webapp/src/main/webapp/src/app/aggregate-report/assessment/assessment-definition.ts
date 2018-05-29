export interface AssessmentDefinition {

  /**
   * Reflective reference to the type code of the assessment
   */
  readonly typeCode: 'sum' | 'iab' | 'ica';

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
   * Performance level display types supported by the assessment type
   */
  readonly performanceLevelDisplayTypes: string[];

  /**
   * The performance level grouping point.
   * Performance levels can be grouped into "below" and "at-or-above" the returned performance level.
   * A value of -1 denotes no rollup.
   *
   * This value is null if performance level display type "Grouped" is not supported
   */
  readonly performanceLevelGroupingCutPoint?: number;

  /**
   * The identity columns to use in aggregate reports for the given assessment definition
   */
  readonly aggregateReportIdentityColumns: string[];

  /**
   * True if the definition supports state results
   */
  readonly aggregateReportStateResultsEnabled: boolean;

  /**
   * An array of report types the definition supports
   */
  readonly aggregateReportTypes: [ 'GeneralPopulation' | 'LongitudinalCohort' | 'Claim' | 'Target' ];
}
