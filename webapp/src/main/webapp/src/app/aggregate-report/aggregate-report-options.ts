import { Organization } from '../shared/organization/organization';
import { ReportQueryType } from '../report/report';
import { SubgroupFilterOptions } from './subgroup/subgroup-filter-options';

export interface Claim {
  readonly assessmentType: string;
  readonly subject: string;
  readonly code: string;
}

export interface AltScore {
  readonly assessmentType: string;
  readonly subject: string;
  readonly code: string;
}

export interface Subject {
  readonly code: string;
  readonly assessmentType: string;
  readonly targetReport?: boolean;
}

/**
 * Represents the aggregate report options as provided by the API
 */
export interface AggregateReportOptions {
  readonly assessmentGrades: string[];
  readonly assessmentTypes: string[];
  readonly claims: Claim[];
  readonly altScores: AltScore[];
  readonly completenesses: string[];
  readonly defaultOrganization?: Organization;
  readonly dimensionTypes?: string[];
  readonly interimAdministrationConditions: string[];
  readonly queryTypes: string[];
  readonly reportTypes: ReportQueryType[];
  readonly schoolYears: number[];
  readonly statewideReporter: boolean;
  readonly subjects: Subject[];
  readonly summativeAdministrationConditions: string[];
  readonly studentFilters: SubgroupFilterOptions;
}
