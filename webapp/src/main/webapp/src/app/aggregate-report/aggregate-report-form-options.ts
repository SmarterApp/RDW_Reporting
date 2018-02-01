import { Option as SbToggleOption } from "../shared/sb-toggle.component";
import { Option as SbCheckboxGroupOption } from "../shared/form/sb-checkbox-group.component";

/**
 * Represents the options available in the aggregate report form
 */
export interface AggregateReportFormOptions {

  achievementLevelDisplayTypes: SbToggleOption[];
  assessmentGrades: SbCheckboxGroupOption[];
  assessmentTypes: SbToggleOption[];
  completenesses: SbCheckboxGroupOption[];
  dimensionTypes: SbCheckboxGroupOption[];
  economicDisadvantages: SbCheckboxGroupOption[];
  ethnicities: SbCheckboxGroupOption[];
  genders: SbCheckboxGroupOption[];
  individualEducationPlans: SbCheckboxGroupOption[];
  interimAdministrationConditions: SbCheckboxGroupOption[];
  limitedEnglishProficiencies: SbCheckboxGroupOption[];
  migrantStatuses: SbCheckboxGroupOption[];
  section504s: SbCheckboxGroupOption[];
  schoolYears: SbCheckboxGroupOption[];
  statewideReporter: boolean;
  subjects: SbCheckboxGroupOption[];
  summativeAdministrationConditions: SbCheckboxGroupOption[];
  valueDisplayTypes: SbToggleOption[];

}

