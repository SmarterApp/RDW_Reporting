export interface StudentFilterOptions {
  readonly genders: string[];
  readonly ethnicities: string[];
  readonly englishLanguageAcquisitionStatuses: string[];
  readonly individualEducationPlans: string[];
  readonly limitedEnglishProficiencies?: string[];
  readonly section504s?: string[];
  readonly migrantStatuses?: string[];
}
