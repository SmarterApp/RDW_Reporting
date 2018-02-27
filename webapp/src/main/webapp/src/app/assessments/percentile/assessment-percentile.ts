/**
 * Represents percentile data for an assessment and date range
 */
export interface Percentile {

  /**
   * The assessment entity ID to which the percentiles belong
   */
  assessmentId: number;

  /**
   * The start date of the effective date range of the percentiles
   */
  startDate: Date;

  /**
   * The end date of the effective date range of the percentiles
   */
  endDate: Date;

  /**
   * The sample size of the percentile
   */
  count: number;

  /**
   * The mean value of the assessment scale scores across the samples
   */
  mean: number;

  /**
   * The standard deviation of the assessment scale scores across the samples
   */
  standardDeviation: number;

  /**
   * The rank-score pairs used to categorize a score into a percentile
   */
  scores: PercentileScore[];

}

/**
 * A rank-score pair (e.g. 25, 2000)
 */
export interface PercentileScore {
  rank: number;
  score: number;
}

/**
 * Represents a collection of percentiles that share the same rank values
 */
export interface PercentileGroup {
  ranks: number[];
  percentiles: Percentile[];
}
