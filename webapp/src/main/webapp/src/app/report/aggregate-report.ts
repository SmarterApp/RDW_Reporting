/**
 * Represents server aggregate report model interface
 */
export interface AggregateReportRow {

  readonly dimension: AggregateReportRowDimension;
  readonly organization: ServerOrganization;
  readonly assessment: AggregateReportRowAssessment;
  readonly measures: AggregateReportRowMeasure;

  /**
   * These measures are present on longitudinal reports only
   */
  readonly cohortMeasures?: AggregateReportRowMeasure;

  /**
   * These properties are present on target reports only
   */
  readonly targetNaturalId?: string;
  readonly studentRelativeResidualScoresLevel?: string;
  readonly standardMetRelativeResidualLevel?: string;
}

export interface ServerOrganization {
  readonly id: number;
  readonly naturalId: string;
  readonly name: string;
  readonly organizationType: string;
}

export interface AggregateReportRowDimension {
  readonly type: string;
  readonly code: string;
}

export interface AggregateReportRowAssessment {
  readonly id: number;
  readonly gradeCode: string;
  readonly subjectCode: string;
  readonly label: string;
  readonly examSchoolYear: number;
}

export interface AggregateReportRowMeasure {
  readonly avgScaleScore: number;
  readonly avgStdErr: number;
  readonly level1Count: number;
  readonly level2Count: number;
  readonly level3Count: number;
  readonly level4Count: number;
  readonly studentCount: number;
}
