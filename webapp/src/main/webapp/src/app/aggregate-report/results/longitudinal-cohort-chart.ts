import { Organization } from '../../shared/organization/organization';
import { Subgroup } from '../subgroup/subgroup';

/**
 * Logical modal for the longitudinal cohort chart
 */
export interface LongitudinalCohortChart {

  /**
   * Assessment performance levels over a span of year/grades
   */
  readonly performanceLevels: PerformanceLevel[];

  /**
   * Organization performance over a span of year/Grades
   */
  readonly organizationPerformances: OrganizationPerformance[];

}

/**
 * Represents the assessment performance level and its changes in scale score range over time
 */
export interface PerformanceLevel {
  readonly id: number;
  readonly name: string;
  readonly color: string;
  readonly yearGradeScaleScoreRanges: YearGradeScaleScoreRange[];
}

/**
 * Represents an organization - subgroup combination's average scale scores over time
 */
export interface OrganizationPerformance {
  readonly organization: Organization;
  readonly subgroup?: Subgroup;
  readonly yearGradeScaleScores: YearGradeScaleScore[];
}

/**
 * A year-grade combination
 */
export interface YearGrade {
  readonly year: number;
  readonly grade: string;
}

/**
 * A number range
 */
export interface NumberRange {
  readonly minimum: number;
  readonly maximum: number;
}

/**
 * A scale score for a specific year and grade
 */
export interface YearGradeScaleScore {
  readonly yearGrade: YearGrade;
  readonly scaleScore: number;
}

/**
 * A scale score range for a specific year and grade
 */
export interface YearGradeScaleScoreRange {
  readonly yearGrade: YearGrade;
  readonly scaleScoreRange: NumberRange;
}
