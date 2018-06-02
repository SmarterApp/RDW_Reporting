export class AggregateTargetScoreRow {
  targetId: number;
  target: string;
  claim: string;
  subgroup: string;
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
