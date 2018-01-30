/**
 * This model represents an aggregate report data table row result.
 */
export class AggregateReportItem {
  itemId: number;
  assessmentId: number;
  gradeId: number;
  subjectId: number;
  schoolYear: number;
  avgScaleScore: number;
  avgStdErr: number;
  studentsTested: any;
  performanceLevelCounts: number[] = [];
  performanceLevelPercents: number[] = [];
  groupedPerformanceLevelCounts: number[] = [];
  groupedPerformanceLevelPercents: number[] = [];
  organizationType: string;
  organizationName: string;
  organizationId: string;
  dimensionType: string;
  dimensionValue: string | boolean;
}
