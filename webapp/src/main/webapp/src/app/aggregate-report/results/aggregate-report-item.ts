import { Organization } from "../../shared/organization/organization";

/**
 * This model represents an aggregate report data table row result.
 * TODO rename to row?
 */
export class AggregateReportItem {
  itemId: number;
  assessmentId: number;
  assessmentLabel: string;
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
  dimension: {id: string, name: string};
}

