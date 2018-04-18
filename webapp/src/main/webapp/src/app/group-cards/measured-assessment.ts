import { Assessment } from '../assessments/model/assessment.model';

export interface MeasuredAssessment {
  readonly assessment: Assessment;
  readonly studentCountByPerformanceLevel: number[];
  readonly averageScaleScore: number;
  readonly averageStandardError: number;
  readonly date: Date;
  readonly studentsTested: number;
}
