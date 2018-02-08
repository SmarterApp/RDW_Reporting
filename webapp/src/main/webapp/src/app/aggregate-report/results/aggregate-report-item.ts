import { Organization } from "../../shared/organization/organization";

/**
 * This model represents an aggregate report data table row result.
 */
export class AggregateReportItem {
  itemId: number;
  assessmentId: number;
  assessmentGradeCode: string;
  subjectCode: string;
  schoolYear: number;
  avgScaleScore: number;
  avgStdErr: number;
  studentsTested: any;
  performanceLevelByDisplayTypes: {
    [performanceLevelDisplayType: string]: {
      [valueDisplayType: string]: number[]
    }
  } = {
    Separate: {
      Number: [],
      Percent: []
    },
    Grouped: {
      Number: [],
      Percent: []
    }
  };
  organization: Organization;
  dimension: Dimension;
}

/**
 * Holds dimension information for display as a report item
 */
export interface Dimension {
  readonly id: string;
  readonly type: string;
  readonly includeType?: boolean;
  readonly code?: string;
  readonly codeTranslationCode?: string;
}
