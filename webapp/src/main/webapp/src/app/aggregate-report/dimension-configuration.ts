import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { Utils } from "../shared/support/support";

interface DimensionConfiguration {
  readonly getDimensionValueCodes: (settings: AggregateReportFormSettings) => string[];
  readonly getTranslationCode: (dimensionCode: string) => string;
}

/**
 * Dimension type code to configuration mappings.
 * These configurations help mapping backend-provided and form-provided dimension data into {Dimension}s
 */
export const DimensionConfigurationByType: { [dimensionType: string]: DimensionConfiguration } = {
  Gender: {
    getDimensionValueCodes: settings => settings.genders,
    getTranslationCode: value => `common.gender.${value}`
  },
  Ethnicity: {
    getDimensionValueCodes: settings => settings.ethnicities,
    getTranslationCode: value => `common.ethnicity.${value}`
  },
  LEP: {
    getDimensionValueCodes: settings => settings.limitedEnglishProficiencies,
    getTranslationCode: value => `common.strict-boolean.${value}`
  },
  MigrantStatus: {
    getDimensionValueCodes: settings => settings.migrantStatuses,
    getTranslationCode: value => `common.boolean.${value}`
  },
  Section504: {
    getDimensionValueCodes: settings => settings.section504s,
    getTranslationCode: value => `common.boolean.${value}`
  },
  IEP: {
    getDimensionValueCodes: settings => settings.individualEducationPlans,
    getTranslationCode: value => `common.strict-boolean.${value}`
  },
  EconomicDisadvantage: {
    getDimensionValueCodes: settings => settings.economicDisadvantages,
    getTranslationCode: value => `common.strict-boolean.${value}`
  },
  StudentEnrolledGrade: {
    getDimensionValueCodes: settings => Utils.isNullOrEmpty(settings.assessmentGrades) ? [] : [ settings.assessmentGrades[0] ],
    getTranslationCode: value => `common.enrolled-grade.${value}`
  }
};
