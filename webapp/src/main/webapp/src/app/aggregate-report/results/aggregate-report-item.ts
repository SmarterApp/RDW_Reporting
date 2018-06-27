import { Organization } from '../../shared/organization/organization';
import { Subgroup } from '../subgroup/subgroup';
import { TargetReportingLevel } from "../../assessments/model/aggregate-target-score-row.model";

/**
 * This model represents an aggregate report data table row result.
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
    [ performanceLevelDisplayType: string ]: {
      [ valueDisplayType: string ]: number[]
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
  subgroup: Subgroup;
  studentRelativeResidualScoresLevel?: TargetReportingLevel;
  standardMetRelativeResidualLevel?: TargetReportingLevel;
  targetNaturalId?: string;

  // NOTE That for Claim reports, this represents a Scorable claim code (e.g. SOCK_R)
  // For Target reports, this represents an Organizational claim code (e.g. 1-LT)
  claimCode?: string;
}

