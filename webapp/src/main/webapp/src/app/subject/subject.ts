export interface SubjectDefinition {
  readonly subject: string;
  readonly assessmentType: string;
  readonly performanceLevels: number[];
  readonly performanceLevelCount: number;
  readonly performanceLevelStandardCutoff: number;
  readonly scorableClaims: string[];
  readonly scorableClaimPerformanceLevels: number[];
  readonly scorableClaimPerformanceLevelCount: number;
}
