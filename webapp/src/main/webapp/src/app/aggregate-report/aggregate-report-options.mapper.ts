import { AggregateReportOptions } from "./aggregate-report-options";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SchoolYearPipe } from "../shared/format/school-year.pipe";
import { DisplayOptionService } from "../shared/display-options/display-option.service";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { ValueDisplayTypes } from "../shared/display-options/value-display-type";
import { PerformanceLevelDisplayTypes } from "../shared/display-options/performance-level-display-type";
import { AssessmentDefinitionService } from './assessment/assessment-definition.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

/**
 * Responsible for mapping server provided report options into option
 * models that can be directly consumed by the UI components
 */
@Injectable()
export class AggregateReportOptionsMapper {

  constructor(private translateService: TranslateService,
              private schoolYearPipe: SchoolYearPipe,
              private displayOptionService: DisplayOptionService,
              private assessmentDefinitionService: AssessmentDefinitionService) {
  }

  /**
   * Maps server representation of report options to translated and sorted options for display in a form
   *
   * @param {AggregateReportOptions} options the server report options
   * @returns {AggregateReportFormOptions} the client report options
   */
  map(options: AggregateReportOptions): AggregateReportFormOptions {
    const optionMapper = this.displayOptionService.createOptionMapper;
    const translate = code => this.translateService.instant(code);
    return <AggregateReportFormOptions>{
      assessmentGrades: options.assessmentGrades
        .map(optionMapper(
          value => translate(`common.assessment-grade.${value}`),
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
          value => translate(`common.boolean.${value}`),
          value => `Migrant Status: ${value}`
        )),
      individualEducationPlans: options.individualEducationPlans
        .map(optionMapper(
          value => translate(`common.strict-boolean.${value}`),
          value => `Individual Education Plan: ${value}`
        )),
      section504s: options.section504s
        .map(optionMapper(
          value => translate(`common.boolean.${value}`),
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
      performanceLevelDisplayTypes: this.displayOptionService.getPerformanceLevelDisplayTypeOptions(),
      valueDisplayTypes: this.displayOptionService.getValueDisplayTypeOptions(),
      dimensionTypes: options.dimensionTypes
        .map(optionMapper(
          value => translate(`common.dimension.${value}`),
          value => `Comparative Subgroup: ${value}`
        )),
      statewideReporter: options.statewideReporter // TODO move to user context?
    };
  }

  /**
   * Creates the default/initial state of the aggregate report form based on the available options
   *
   * @param {AggregateReportFormOptions} options the options available for selection
   * @returns {AggregateReportFormSettings} the initial form state
   */
  toDefaultSettings(options: AggregateReportOptions): Observable<AggregateReportFormSettings> {
    return this.assessmentDefinitionService.getDefinitionsByAssessmentTypeCode().pipe(
      map(definitions => {
        const defaultAssessmentType = options.assessmentTypes[ 0 ];
        const assessmentDefinition = definitions.get(defaultAssessmentType);
        return <AggregateReportFormSettings>{
          assessmentGrades: [],
          assessmentType: defaultAssessmentType,
          completenesses: [ options.completenesses[ 0 ] ],
          ethnicities: options.ethnicities,
          genders: options.genders,
          interimAdministrationConditions: [ options.interimAdministrationConditions[ 0 ] ],
          schoolYears: [ options.schoolYears[ 0 ] ],
          subjects: options.subjects,
          summativeAdministrationConditions: [ options.summativeAdministrationConditions[ 0 ] ],
          migrantStatuses: options.migrantStatuses,
          individualEducationPlans: options.individualEducationPlans,
          section504s: options.section504s,
          limitedEnglishProficiencies: options.limitedEnglishProficiencies,
          economicDisadvantages: options.economicDisadvantages,
          performanceLevelDisplayType: assessmentDefinition.performanceLevelDisplayTypes[ 0 ],
          valueDisplayType: ValueDisplayTypes.Percent,
          columnOrder: assessmentDefinition.aggregateReportIdentityColumns,
          dimensionTypes: [],
          includeStateResults: true,
          includeAllDistricts: false,
          includeAllSchoolsOfSelectedDistricts: false,
          includeAllDistrictsOfSelectedSchools: true,
          districts: [],
          schools: []
        }
      })
    );
  }

}
