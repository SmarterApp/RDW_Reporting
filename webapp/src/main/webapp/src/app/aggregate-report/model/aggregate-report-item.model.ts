/**
 * This model represents an aggregate report data table row result.
 */
export class AggregateReportItem {
  itemId: number;
  assessmentId: number;
  gradeId: number;
  subjectId: number;
  schoolYear: number;
  avgScaleScore: string | number;
  avgStdErr: string | number;
  studentsTested: any;
  performanceLevelCounts: (number | string)[] = [];
  performanceLevelPercents: (number | string)[] = [];
  groupedPerformanceLevelCounts: (number | string)[] = [];
  groupedPerformanceLevelPercents: (number | string)[] = [];
  organizationType: string;
  organizationName: string;
  organizationId: string;
  dimensionType: string;
  dimensionValue: string | boolean;
}
