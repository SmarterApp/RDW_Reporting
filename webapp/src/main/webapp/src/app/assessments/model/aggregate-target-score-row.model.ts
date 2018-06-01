export class AggregateTargetScoreRow {
  targetId: number;
  targetNaturalId: string;
  claimCode: string;
  studentsTested: number;
  standardMetRelativeLevel: TargetReportingLevel;
  studentRelativeLevel: TargetReportingLevel;
}

export enum TargetReportingLevel {
  Above,
  Near,
  Below,
  InsufficientData,
  Excluded
}
