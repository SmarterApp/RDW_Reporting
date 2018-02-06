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

    // Used to hotfix natural order of completeness and strict booleans not being in "affirmative-first" order
    const IdDescending = (a, b) => a.id - b.id;

    return <AggregateReportFormOptions>{
      assessmentGrades: options.assessmentGrades
        .map(optionMapper(
          value => translate(`common.grade.${value.code}.form-name`),
          value => `Assessment Grade: ${value.code}`
        )),
      assessmentTypes: options.assessmentTypes
        .map(optionMapper(
          value => translate(`common.assessment-type.${value.code}.short-name`),
          value => `Assessment Type: ${value.code}`
        )),
      completenesses: options.completenesses
        .map(optionMapper(
          value => translate(`common.completeness.${value.code}`),
          value => `Completeness: ${value.code}`
        ))
        .sort(IdDescending),
      ethnicities: options.ethnicities
        .map(optionMapper(
          value => translate(`common.ethnicity.${value.code}`),
          value => `Ethnicity: ${value.code}`
        )),
      genders: options.genders
        .map(optionMapper(
          value => translate(`common.gender.${value.code}`),
          value => `Gender: ${value.code}`
        )),
      interimAdministrationConditions: options.interimAdministrationConditions
        .map(optionMapper(
          value => translate(`common.administration-condition.${value.code}`),
          value => `Manner of Administration: ${value.code}`
        )),
      schoolYears: options.schoolYears
        .map(optionMapper(
          value => this.schoolYearPipe.transform(value),
          value => `School Year: ${value}`
        )),
      subjects: options.subjects
        .map(optionMapper(
          value => translate(`common.subject.${value.code}.short-name`),
          value => `Subject: ${value.code}`
        )),
      summativeAdministrationConditions: options.summativeAdministrationConditions
        .map(optionMapper(
          value => translate(`common.administration-condition.${value.code}`),
          value => `Validity: ${value.code}`
        )),
      migrantStatuses: options.migrantStatuses
        .map(optionMapper(
          value => translate(`common.strict-boolean.${value.code}`),
          value => `Migrant Status: ${value.code}`
        ))
        .sort(IdDescending),
      individualEducationPlans: options.individualEducationPlans
        .map(optionMapper(
          value => translate(`common.strict-boolean.${value.code}`),
          value => `Individual Education Plan: ${value.code}`
        ))
        .sort(IdDescending),
      section504s: options.section504s
        .map(optionMapper(
          value => translate(`common.strict-boolean.${value.code}`),
          value => `Section 504: ${value.code}`
        ))
        .sort(IdDescending),
      limitedEnglishProficiencies: options.limitedEnglishProficiencies
        .map(optionMapper(
          value => translate(`common.strict-boolean.${value.code}`),
          value => `Limited English Proficiency: ${value.code}`
        ))
        .sort(IdDescending),
      economicDisadvantages: options.economicDisadvantages
        .map(optionMapper(
          value => translate(`common.strict-boolean.${value.code}`),
          value => `Economic Disadvantage: ${value.code}`
        ))
        .sort(IdDescending),
      performanceLevelDisplayTypes: [ 'Separate', 'Grouped' ]
        .map(optionMapper(
          value => translate(`aggregate-reports.form.field.performance-level-display-type.value.${value}`),
          value => `Achievement Level Display Type: ${value}`
        )),
      valueDisplayTypes: [ 'Percent', 'Number' ]
        .map(optionMapper(
          value => translate(`aggregate-reports.form.field.value-display-type.value.${value}`),
          value => `Value Display Type: ${value}`
        )),
      dimensionTypes: options.dimensionTypes
        .map(optionMapper(
          value => translate(`aggregate-reports.form.field.comparative-subgroup.value.${value}`),
          value => `Comparative Subgroup: ${value}`
        )),
      statewideReporter: options.statewideReporter
    };
  }

}
