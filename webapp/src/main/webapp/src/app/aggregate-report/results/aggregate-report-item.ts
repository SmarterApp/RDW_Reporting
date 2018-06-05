import { Organization } from '../../shared/organization/organization';
import { Subgroup } from '../subgroup/subgroup';

/**
 * This model represents an aggregate report data table row result.
 */
export class AggregateReportItem {
  itemId: number;
  assessmentId: number;
  assessmentLabel: string;
  assessmentGradeCode: string;
  claimCode?: string;
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
  studentRelativeResidualScoresLevel?: 'Above' | 'Near' | 'Below' | 'InsufficientData' | 'Excluded';
  standardMetRelativeResidualLevel?: 'Above' | 'Near' | 'Below' | 'InsufficientData' | 'Excluded';
  organizationalClaimCode?: string;
  targetNaturalId?: string;
  targetCode?: string;
  targetDescription?: string;
}

