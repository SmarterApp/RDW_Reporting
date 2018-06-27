export interface Target {
  readonly id: number;
  readonly assessmentId: number;
  readonly claimCode: string;
  readonly naturalId: string;
  readonly includeInReport: boolean;
}
