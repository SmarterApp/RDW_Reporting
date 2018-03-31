import { Organization } from "../../shared/organization/organization";
import { Dimension } from '../subgroup.mapper';
import { SubgroupFiltersListItem } from '../subgroup-filters-list-item';

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

  // Present for Basic queries
  dimension?: Dimension;

  // Present for FilteredSubgroup queries
  subgroup?: SubgroupFiltersListItem;
}

