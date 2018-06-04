export interface Target {
  readonly id: number;
  readonly assessmentId: number;
  readonly claimCode: string;
  readonly naturalId: string;
  readonly code: string;
  readonly description: string;
  readonly includeInReport: boolean;
}
