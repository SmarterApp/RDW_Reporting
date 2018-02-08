import { AggregateReportOptions } from "./aggregate-report-options";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SchoolYearPipe } from "../shared/format/school-year.pipe";

/**
 * Responsible for mapping server provided report options into option
 * models that can be directly consumed by the UI components
 */
@Injectable()
export class AggregateReportFormOptionsMapper {

  constructor(private translate: TranslateService,
              private schoolYearPipe: SchoolYearPipe) {
  }

  /**
   * Maps server representation of report options to translated and sorted options for display in a form
   *
   * @param {AggregateReportOptions} options the server report options
   * @returns {AggregateReportFormOptions} the client report options
   */
  map(options: AggregateReportOptions): AggregateReportFormOptions {

    // Allows for creating option mappers concisely for better readability
    const optionMapper = (translationProvider: (value: any) => string, labelProvider: (value: any) => string): any =>
      (value: any) => <any>{
        value: value,
        text: translationProvider(value),
        label: labelProvider(value)
      };

    // Allows for translating messages incline concisely for better readability
    const translate = code => this.translate.instant(code);

    return <AggregateReportFormOptions>{
      assessmentGrades: options.assessmentGrades
        .map(optionMapper(
          value => translate(`common.grade.${value}.form-name`),
          value => `Assessment Grade: ${value}`
        )),
      assessmentTypes: options.assessmentTypes
        .map(optionMapper(
          value => translate(`common.assessment-type.${value}.short-name`),
          value => `Assessment Type: ${value}`
        )),
      completenesses: options.completenesses
        .map(optionMapper(
          value => translate(`common.completeness.${value}`),
          value => `Completeness: ${value}`
        )),
      ethnicities: options.ethnicities
        .map(optionMapper(
          value => translate(`common.ethnicity.${value}`),
          value => `Ethnicity: ${value}`
        )),
      genders: options.genders
        .map(optionMapper(
          value => translate(`common.gender.${value}`),
          value => `Gender: ${value}`
        )),
      interimAdministrationConditions: options.interimAdministrationConditions
        .map(optionMapper(
          value => translate(`common.administration-condition.${value}`),
          value => `Manner of Administration: ${value}`
        )),
      schoolYears: options.schoolYears
        .map(optionMapper(
          value => this.schoolYearPipe.transform(value),
          value => `School Year: ${value}`
        )),
      subjects: options.subjects
        .map(optionMapper(
          value => translate(`common.subject.${value}.short-name`),
          value => `Subject: ${value}`
        )),
      summativeAdministrationConditions: options.summativeAdministrationConditions
        .map(optionMapper(
          value => translate(`common.administration-condition.${value}`),
          value => `Validity: ${value}`
        )),
      migrantStatuses: options.migrantStatuses
        .map(optionMapper(
          value => translate(`common.strict-boolean.${value}`),
          value => `Migrant Status: ${value}`
        )),
      individualEducationPlans: options.individualEducationPlans
        .map(optionMapper(
          value => translate(`common.strict-boolean.${value}`),
          value => `Individual Education Plan: ${value}`
        )),
      section504s: options.section504s
        .map(optionMapper(
          value => translate(`common.strict-boolean.${value}`),
          value => `Section 504: ${value}`
        )),
      limitedEnglishProficiencies: options.limitedEnglishProficiencies
        .map(optionMapper(
          value => translate(`common.strict-boolean.${value}`),
          value => `Limited English Proficiency: ${value}`
        )),
      economicDisadvantages: options.economicDisadvantages
        .map(optionMapper(
          value => translate(`common.strict-boolean.${value}`),
          value => `Economic Disadvantage: ${value}`
        )),
      performanceLevelDisplayTypes: [ 'Separate', 'Grouped' ]
        .map(optionMapper(
          value => translate(`common.performance-level-display-type.${value}`),
          value => `Achievement Level Display Type: ${value}`
        )),
      valueDisplayTypes: [ 'Percent', 'Number' ]
        .map(optionMapper(
          value => translate(`common.value-display-type.${value}`),
          value => `Value Display Type: ${value}`
        )),
      dimensionTypes: options.dimensionTypes
        .map(optionMapper(
          value => translate(`common.dimension.${value}`),
          value => `Comparative Subgroup: ${value}`
        )),
      statewideReporter: options.statewideReporter // TODO move to user context?
    };
  }

}
