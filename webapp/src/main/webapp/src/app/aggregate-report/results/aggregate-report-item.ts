/**
 * This model represents an aggregate report data table row result.
 */
import { Organization } from "../../shared/organization/organization";

export class AggregateReportItem {
  itemId: number;
  assessmentId: number;
  /**
   * @deprecated
   */
  gradeId: number;
  gradeCode: string;
  /**
   * @deprecated
   */
  subjectId: number;
  subjectCode: string;
  schoolYear: number;
  avgScaleScore: number;
  avgStdErr: number;
  studentsTested: any;
  performanceLevelCounts: number[] = [];
  performanceLevelPercents: number[] = [];
  groupedPerformanceLevelCounts: number[] = [];
  groupedPerformanceLevelPercents: number[] = [];
  organization: Organization;
  dimensionType: string;
  dimensionValue: string | boolean;
}
