import { Subgroup } from '../../aggregate-report/subgroup/subgroup';

export class AggregateTargetScoreRow {
  targetId: number;
  target: string;
  claim: string;
  subgroup: Subgroup;
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
