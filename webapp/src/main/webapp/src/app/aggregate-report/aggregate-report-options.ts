import { Organization } from "../shared/organization/organization";
import { SubgroupFilterOptions } from "./subgroup/subgroup-filter-options";

/**
 * Represents the aggregate report options as provided by the API
 */
export interface AggregateReportOptions {

  readonly assessmentGrades: string[];
  readonly assessmentTypes: string[];
  readonly claimCodes: string[];
  readonly completenesses: string[];
  readonly defaultOrganization?: Organization;
  readonly dimensionTypes?: string[];
  readonly interimAdministrationConditions: string[];
  readonly queryTypes: string[];
  readonly reportTypes: string[];
  readonly schoolYears: number[];
  readonly statewideReporter: boolean;
  readonly subjects: string[];
  readonly summativeAdministrationConditions: string[];
  readonly studentFilters: SubgroupFilterOptions;

}
