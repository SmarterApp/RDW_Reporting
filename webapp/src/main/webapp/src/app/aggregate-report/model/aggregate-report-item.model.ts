/**
 * This model represents an aggregate report entry
 */
export class AggregateReportItem {
  itemId: number;
  assessmentId: number;
  gradeId: number;
  subjectId: number;
  schoolYear: number;
  avgScaleScore: number;
  avgStdErr: number;
  studentsTested: number;
  performanceLevelCounts: number[] = [];
  performanceLevelPercents: number[] = [];
  groupedPerformanceLevelCounts: number[] = [];
  groupedPerformanceLevelPercents: number[] = [];
  organizationType: string;
  organizationName: string;
  organizationId: string;
  dimensionType: string;
  dimensionValue: string;
}
