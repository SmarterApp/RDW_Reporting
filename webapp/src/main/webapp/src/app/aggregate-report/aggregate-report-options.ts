import { Organization } from "../shared/organization/organization";

/**
 * Represents the aggregate report options as provided by the API
 */
export interface AggregateReportOptions {

  readonly assessmentGrades: string[];
  readonly assessmentTypes: string[];
  readonly completenesses: string[];
  readonly defaultOrganization?: Organization;
  readonly dimensionTypes?: string[];
  readonly economicDisadvantages: string[];
  readonly ethnicities: string[];
  readonly genders: string[];
  readonly individualEducationPlans: string[];
  readonly interimAdministrationConditions: string[];
  readonly limitedEnglishProficiencies: string[];
  readonly migrantStatuses: string[];
  readonly section504s: string[];
  readonly schoolYears: number[];
  readonly statewideReporter: boolean;
  readonly subjects: string[];
  readonly summativeAdministrationConditions: string[];

}
