import { Subgroup } from '../../aggregate-report/subgroup/subgroup';
import { ranking } from '@kourge/ordering/comparator';

export class AggregateTargetScoreRow {
  targetId: number;
  target: string;
  claim: string;
  claimOrder: number;
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
  Excluded,
  NoResults
}

export const byTargetReportingLevel = ranking<TargetReportingLevel>([
  TargetReportingLevel.Above,
  TargetReportingLevel.Near,
  TargetReportingLevel.Below,
  TargetReportingLevel.InsufficientData,
  TargetReportingLevel.Excluded,
  TargetReportingLevel.NoResults
]);
