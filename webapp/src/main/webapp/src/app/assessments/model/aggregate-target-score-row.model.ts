export class AggregateTargetScoreRow {
  targetId: number;
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
