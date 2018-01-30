/**
 * Represents the aggregate report options as provided by the API
 */
export interface AggregateReportOptions {

  readonly assessmentGrades: CodedEntity[];
  readonly assessmentTypes: CodedEntity[];
  readonly completenesses: CodedEntity[];
  readonly dimensionTypes: string[];
  readonly economicDisadvantages: any[];
  readonly ethnicities: CodedEntity[];
  readonly genders: CodedEntity[];
  readonly ieps: any[];
  readonly interimAdministrationConditions: CodedEntity[];
  readonly limitedEnglishProficiencies: any[];
  readonly migrantStatuses: any[];
  readonly plan504s: any[];
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
