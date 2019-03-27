import { AggregateReportOptions } from './aggregate-report-options';
import { AggregateReportFormOptions } from './aggregate-report-form-options';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SchoolYearPipe } from '../shared/format/school-year.pipe';
import { DisplayOptionService } from '../shared/display-options/display-option.service';
import { AggregateReportFormSettings } from './aggregate-report-form-settings';
import { ValueDisplayTypes } from '../shared/display-options/value-display-type';
import { AssessmentDefinitionService } from './assessment/assessment-definition.service';
import { Observable, of } from 'rxjs';
import { ApplicationSettingsService } from '../app-settings.service';
import { Claim } from './aggregate-report-options.service';
import { ReportQueryType } from '../report/report';

/**
 * Responsible for mapping server provided report options into option
 * models that can be directly consumed by the UI components
 */
@Injectable()
export class AggregateReportOptionsMapper {
  private showElas = false;
  private showLep = false;

  constructor(
    private translateService: TranslateService,
    private schoolYearPipe: SchoolYearPipe,
    private displayOptionService: DisplayOptionService,
    private assessmentDefinitionService: AssessmentDefinitionService,
    private applicationSettingsService: ApplicationSettingsService
  ) {
    applicationSettingsService.getSettings().subscribe(settings => {
      this.showElas = settings.elasEnabled;
      this.showLep = settings.lepEnabled;
    });
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
      assessmentGrades: options.assessmentGrades.map(
        optionMapper(
          value => translate(`common.assessment-grade.${value}`),
          value => `Assessment Grade: ${value}`
        )
      ),
      assessmentTypes: options.assessmentTypes.map(
        optionMapper(
          value => translate(`common.assessment-type.${value}.short-name`),
          value => `Assessment Type: ${value}`
        )
      ),
      claimCodes: options.claims.map(
        optionMapper(
          (value: Claim) =>
            translate(`subject.${value.subject}.claim.${value.code}.name`),
          (value: Claim) => `Claim Code: ${value.code}`
        )
      ),
      completenesses: options.completenesses.map(
        optionMapper(
          value => translate(`common.completeness.${value}`),
          value => `Completeness: ${value}`
        )
      ),
      interimAdministrationConditions: options.interimAdministrationConditions.map(
        optionMapper(
          value => translate(`common.administration-condition.${value}`),
          value => `Manner of Administration: ${value}`
        )
      ),
      schoolYears: options.schoolYears
        .concat()
        .sort()
        .map(
          optionMapper(
            value => this.schoolYearPipe.transform(value),
            value => `School Year: ${value}`
          )
        ),
      subjects: options.subjects.map(
        optionMapper(
          value => translate(`subject.${value.code}.name`),
          value => `Subject: ${value.code}`
        )
      ),
      summativeAdministrationConditions: options.summativeAdministrationConditions.map(
        optionMapper(
          value => translate(`common.administration-condition.${value}`),
          value => `Validity: ${value}`
        )
      ),
      performanceLevelDisplayTypes: this.displayOptionService.getPerformanceLevelDisplayTypeOptions(),
      valueDisplayTypes: this.displayOptionService.getValueDisplayTypeOptions(),
      dimensionTypes: options.dimensionTypes
        .filter(dimensionType => this.filterElasOrLep(dimensionType))
        .map(
          optionMapper(
            value => translate(`common.dimension.${value}`),
            value => `Comparative Subgroup: ${value}`
          )
        ),
      reportTypes: options.reportTypes.map(
        optionMapper(
          value => translate(`common.aggregate-report-type.${value}.label`),
          value => `Aggregate Report Type: ${value}`,
          value =>
            translate(`common.aggregate-report-type.${value}.description`),
          value => translate(`common.aggregate-report-type.${value}.disabled`)
        )
      ),
      statewideReporter: options.statewideReporter, // TODO move to user context?
      studentFilters: {
        economicDisadvantages: options.studentFilters.economicDisadvantages.map(
          optionMapper(
            value => translate(`common.strict-boolean.${value}`),
            value => `Economic Disadvantage: ${value}`
          )
        ),
        ethnicities: options.studentFilters.ethnicities.map(
          optionMapper(
            value => translate(`common.ethnicity.${value}`),
            value => `Ethnicity: ${value}`
          )
        ),
        genders: options.studentFilters.genders.map(
          optionMapper(
            value => translate(`common.gender.${value}`),
            value => `Gender: ${value}`
          )
        ),
        individualEducationPlans: options.studentFilters.individualEducationPlans.map(
          optionMapper(
            value => translate(`common.strict-boolean.${value}`),
            value => `Individual Education Plan: ${value}`
          )
        ),
        limitedEnglishProficiencies: options.studentFilters.limitedEnglishProficiencies.map(
          optionMapper(
            value => translate(`common.strict-boolean.${value}`),
            value => `Limited English Proficiency: ${value}`
          )
        ),
        englishLanguageAcquisitionStatuses: options.studentFilters.englishLanguageAcquisitionStatuses.map(
          optionMapper(
            value => translate(`common.elas.${value}`),
            value => `English Language Acquisition Status: ${value}`
          )
        ),
        migrantStatuses: options.studentFilters.migrantStatuses.map(
          optionMapper(
            value => translate(`common.boolean.${value}`),
            value => `Migrant Status: ${value}`
          )
        ),
        section504s: options.studentFilters.section504s.map(
          optionMapper(
            value => translate(`common.boolean.${value}`),
            value => `Section 504: ${value}`
          )
        ),
        languages: options.studentFilters.languages.map(
          optionMapper(
            value => translate(`common.languages.${value}`),
            value => `Primary Language Codes: ${value}`
          )
        ),
        militaryConnectedCodes: options.studentFilters.militaryConnectedCodes.map(
          optionMapper(
            value => translate(`common.military-connected-code.${value}`),
            value => `Military Student Identifier: ${value}`
          )
        )
      }
    };
  }

  private filterElasOrLep(dimensionType: string): boolean {
    return (
      (dimensionType !== 'LEP' || this.showLep) &&
      (dimensionType !== 'ELAS' || this.showElas)
    );
  }

  /**
   * Creates the default/initial state of the aggregate report form based on the available options
   *
   * @param {AggregateReportFormOptions} options the options available for selection
   * @returns {AggregateReportFormSettings} the initial form state
   */
  toDefaultSettings(
    options: AggregateReportOptions
  ): Observable<AggregateReportFormSettings> {
    const defaultAssessmentType = options.assessmentTypes[0];
    const defaultReportType: ReportQueryType = options.reportTypes[0];
    const assessmentDefinition = this.assessmentDefinitionService.get(
      defaultAssessmentType,
      defaultReportType
    );
    return of(<AggregateReportFormSettings>{
      assessmentType: defaultAssessmentType,
      columnOrder: assessmentDefinition.aggregateReportIdentityColumns.concat(),
      completenesses: [options.completenesses[0]],
      dimensionTypes: [],
      districts: [],
      includeStateResults: true,
      includeAllDistricts: false,
      includeAllSchoolsOfSelectedDistricts: false,
      includeAllDistrictsOfSelectedSchools: true,
      interimAdministrationConditions: [
        options.interimAdministrationConditions[0]
      ],
      performanceLevelDisplayType:
        assessmentDefinition.performanceLevelDisplayTypes[0],
      queryType: options.queryTypes[0],
      reportType: options.reportTypes[0],
      summativeAdministrationConditions: [
        options.summativeAdministrationConditions[0]
      ],
      schools: [],
      showEmpty: true,
      generalPopulation: {
        assessmentGrades: [],
        schoolYears: [options.schoolYears[0]]
      },
      claimReport: {
        assessmentGrades: [],
        schoolYears: [options.schoolYears[0]],
        claimCodesBySubject: []
      },
      longitudinalCohort: {
        assessmentGrades: [],
        toSchoolYear: options.schoolYears[0]
      },
      studentFilters: {
        economicDisadvantages: options.studentFilters.economicDisadvantages.concat(),
        ethnicities: options.studentFilters.ethnicities.concat(),
        genders: options.studentFilters.genders.concat(),
        individualEducationPlans: options.studentFilters.individualEducationPlans.concat(),
        limitedEnglishProficiencies: options.studentFilters.limitedEnglishProficiencies.concat(),
        englishLanguageAcquisitionStatuses: options.studentFilters.englishLanguageAcquisitionStatuses.concat(),
        migrantStatuses: options.studentFilters.migrantStatuses.concat(),
        section504s: options.studentFilters.section504s.concat(),
        languages: options.studentFilters.languages.concat(),
        militaryConnectedCodes: options.studentFilters.militaryConnectedCodes.concat()
      },
      targetReport: {
        assessmentGrade: options.assessmentGrades[0],
        schoolYear: options.schoolYears[0],
        subjectCode: options.subjects[0].code
      },
      subjects: options.subjects.concat(),
      subgroups: [],
      valueDisplayType: ValueDisplayTypes.Percent
    });
  }
}
