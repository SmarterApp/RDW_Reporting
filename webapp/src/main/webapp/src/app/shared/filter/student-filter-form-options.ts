import { Option } from '../form/option';

export interface StudentFilterFormOptions {

  readonly genders: Option[];
  readonly ethnicities: Option[];
  readonly englishLanguageAcquisitionStatuses: Option[];
  readonly individualEducationPlans: Option[];
  readonly limitedEnglishProficiencies: Option[];
  readonly section504s: Option[];
  readonly migrantStatuses: Option[];

}
