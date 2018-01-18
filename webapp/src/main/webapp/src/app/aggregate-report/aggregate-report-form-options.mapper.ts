import { AggregateReportOptions } from "./aggregate-report-options";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { Injectable } from "@angular/core";
import { Option as SbToggleOption } from "../shared/sb-toggle.component";
import { Option as SbCheckboxGroupOption } from "../shared/form/sb-checkbox-group.component";
import { TranslateService } from "@ngx-translate/core";
import { SchoolYearPipe } from "../shared/format/school-year.pipe";

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
    return <AggregateReportFormOptions>{
      assessmentGrades: options.assessmentGrades
        .map(entity => <SbCheckboxGroupOption>{
          value: entity,
          text: this.translate.instant(`common.grade.${entity.code}.form-name`),
          analyticsProperties: { label: `Assessment Grade: ${entity.code}` }
        })
        .sort((a, b) => a.value.id - b.value.id),
      assessmentTypes: options.assessmentTypes
        .map(entity => <SbToggleOption>{
          value: entity,
          text: this.translate.instant(`common.assessment-type.${entity.code}.short-name`)
        })
        .sort((a, b) => a.text.localeCompare(b.text)),
      completenesses: options.completenesses
        .map(entity => <SbCheckboxGroupOption>{
          value: entity,
          text: this.translate.instant(`common.completeness.${entity.code}`),
          analyticsProperties: { label: `Completeness: ${entity.code}` }
        }),
      ethnicities: options.ethnicities
        .map(entity => <SbCheckboxGroupOption>{
          value: entity,
          text: this.translate.instant(`common.ethnicity.${entity.code}`),
          analyticsProperties: { label: `Ethnicity: ${entity.code}` }
        })
        .sort((a, b) => a.text.localeCompare(b.text)),
      genders: options.genders
        .map(entity => <SbCheckboxGroupOption>{
          value: entity,
          text: this.translate.instant(`common.gender.${entity.code}`),
          analyticsProperties: { label: `Gender: ${entity.code}` }
        })
        .sort((a, b) => a.value.id - b.value.id),
      interimAdministrationConditions: options.interimAdministrationConditions
        .map(entity => <SbCheckboxGroupOption>{
          value: entity,
          text: this.translate.instant(`common.administration-condition.${entity.code}`),
          analyticsProperties: { label: `Manner of Administration: ${entity.code}` }
        }),
      schoolYears: options.schoolYears
        .map(year => <SbCheckboxGroupOption>{
          value: year,
          text: this.schoolYearPipe.transform(year),
          analyticsProperties: { label: `Assessment Grade: ${year}` }
        })
        .sort((a, b) => b.value - a.value),
      subjects: options.subjects
        .map(entity => <SbCheckboxGroupOption>{
          value: entity,
          text: this.translate.instant(`common.subject.${entity.code}.short-name`),
          analyticsProperties: { label: `Subject: ${entity.code}` }
        })
        .sort((a, b) => a.text.localeCompare(b.text)),
      summativeAdministrationConditions: options.summativeAdministrationConditions
        .map(entity => <SbCheckboxGroupOption>{
          value: entity,
          text: this.translate.instant(`common.administration-condition.${entity.code}`),
          analyticsProperties: { label: `Validity: ${entity.code}` }
        }),
      migrantStatuses: options.migrantStatuses
        .map(value => <SbCheckboxGroupOption>{
          value: value,
          text: this.translate.instant(`common.form-field-boolean-values.${value}`),
          analyticsProperties: { label: `Migrant Status: ${value}` }
        }),
      ieps: options.migrantStatuses
        .map(value => <SbCheckboxGroupOption>{
          value: value,
          text: this.translate.instant(`common.form-field-boolean-values.${value}`),
          analyticsProperties: { label: `IEP: ${value}` }
        }),
      plan504s: options.plan504s
        .map(value => <SbCheckboxGroupOption>{
          value: value,
          text: this.translate.instant(`common.form-field-boolean-values.${value}`),
          analyticsProperties: { label: `504 Plan: ${value}` }
        }),
      limitedEnglishProficiencies: options.limitedEnglishProficiencies
        .map(value => <SbCheckboxGroupOption>{
          value: value,
          text: this.translate.instant(`common.form-field-boolean-values.${value}`),
          analyticsProperties: { label: `Limited English Proficiency: ${value}` }
        }),
      economicDisadvantages: options.economicDisadvantages
        .map(value => <SbCheckboxGroupOption>{
          value: value,
          text: this.translate.instant(`common.form-field-boolean-values.${value}`),
          analyticsProperties: { label: `Economic Disadvantage: ${value}` }
        })
    };
  }

}
