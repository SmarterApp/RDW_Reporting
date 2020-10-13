// TODO consider renaming this to SubjectAssessmentDefinition as it is the combination of a subject+assessment def
/**
 * This is a subject and assessment specific configuration
 */
export interface SubjectDefinition {
  /**
   * The subject code
   */
  readonly subject: string;

  /**
   * The assessment type code
   */
  readonly assessmentType: string;

  /** @deprecated use overallScores */
  readonly performanceLevels: number[];
  /** @deprecated use overallScores */
  readonly performanceLevelCount: number;
  /** @deprecated use overallScores */
  readonly performanceLevelStandardCutoff: number;

  /** @deprecated use claimScore  */
  readonly scorableClaims: string[];
  /** @deprecated use claimScore */
  readonly scorableClaimPerformanceLevels: number[];
  /** @deprecated use claimScore */
  readonly scorableClaimPerformanceLevelCount: number;

  /** @deprecated use alternateScore */
  readonly alternateScoreCodes?: string[];
  /** @deprecated use alternateScore */
  readonly alternateScorePerformanceLevels?: number[];
  /** @deprecated use alternateScore */
  readonly alternateScorePerformanceLevelCount?: number;

  /**
   * Overall score information
   */
  readonly overallScore: OverallScoreDefinition;

  /**
   * Alt score information
   */
  readonly alternateScore?: ScoreDefinition;

  /**
   * Claim score information
   */
  readonly claimScore?: ScoreDefinition;

  /**
   * If true, the percentiles view is enabled for this subject/assessment combination
   */
  readonly percentiles?: boolean;

  /**
   * If true, target reports can be viewed for this subject/assessment combination
   */
  readonly targetReportsEnabled?: boolean;

  /**
   * If true, printable reports can be created for this subject/assessment combination
   */
  readonly printedReportsEnabled?: boolean;
}

export interface OverallScoreDefinition {
  /**
   * The performance levels
   */
  readonly levels: number[];

  /**
   * The total number of performance levels
   */
  readonly levelCount: number;

  /**
   * The standard cutoff point within the levels
   */
  readonly standardCutoff: number;
}

export interface ScoreDefinition {
  /**
   * The sub score codes or identifiers
   */
  readonly codes: string[];

  /**
   * The performance levels
   */
  readonly levels: number[];

  /**
   * The total number of performance levels
   */
  readonly levelCount: number;
}
