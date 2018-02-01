/**
 * Represents the aggregate report options as provided by the API
 */
export interface AggregateReportOptions {

  readonly assessmentGrades: CodedEntity[];
  readonly assessmentTypes: CodedEntity[];
  readonly completenesses: CodedEntity[];
  readonly dimensionTypes: string[];
  readonly economicDisadvantages: CodedEntity[];
  readonly ethnicities: CodedEntity[];
  readonly genders: CodedEntity[];
  readonly individualEducationPlans: CodedEntity[];
  readonly interimAdministrationConditions: CodedEntity[];
  readonly limitedEnglishProficiencies: CodedEntity[];
  readonly migrantStatuses: CodedEntity[];
  readonly section504s: CodedEntity[];
  readonly schoolYears: number[];
  readonly statewideReporter: boolean;
  readonly subjects: CodedEntity[];
  readonly summativeAdministrationConditions: CodedEntity[];

}

/**
 * An entity ID - code pair
 */
export interface CodedEntity {

  readonly id: number;
  readonly code: string;

}
