/**
 * Represents server aggregate report model interface
 */
export interface AggregateReportRow {
  readonly dimension: AggregateReportRowDimension;
  readonly organization: any;
  readonly assessment: AggregateReportRowAssessment;
  readonly measures: AggregateReportRowMeasure;
}

export interface AggregateReportRowDimension {
  readonly type: string;
  readonly code: string;
}

export interface AggregateReportRowAssessment {
  readonly id: number;
  /**
   * @deprecated
   */
  readonly gradeId?: number;
  readonly gradeCode: string; // TODO add to backend
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
}
