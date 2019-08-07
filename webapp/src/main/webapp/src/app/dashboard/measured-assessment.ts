import { Assessment } from '../assessments/model/assessment.model';

export interface MeasuredAssessment {
  readonly assessment: Assessment;
  readonly studentCountByPerformanceLevel: DetailsByPerformanceLevel[];
  readonly averageScaleScore: number;
  readonly averageStandardError?: number;
  readonly date: Date;
  readonly studentsTested: number;
}

export interface DetailsByPerformanceLevel {
  readonly studentCount: number;
  readonly percent: number;
}
