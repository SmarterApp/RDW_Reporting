import { Assessment } from './assessment.model';

export class MeasuredAssessment {
  assessment: Assessment;
  level1Count: number;
  level2Count: number;
  level3Count: number;
  avgScaleScore: number;
  avgStdErr: number;
  studentsTested: number;
  completedAt: Date;
}
