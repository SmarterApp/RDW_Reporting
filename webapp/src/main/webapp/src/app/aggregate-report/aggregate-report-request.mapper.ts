import { Injectable } from '@angular/core';
import { AggregateReportQuery, AggregateReportRequest, StudentFilters } from '../report/aggregate-report-request';
import { AggregateReportFormSettings, AggregateReportType } from './aggregate-report-form-settings';
import { AggregateReportFormOptions } from './aggregate-report-form-options';
import { TranslateService } from '@ngx-translate/core';
import { AssessmentDefinition } from './assessment/assessment-definition';
import { AggregateReportOptions } from './aggregate-report-options';
import { Observable ,  forkJoin ,  of } from 'rxjs';
import { District, OrganizationType, School } from '../shared/organization/organization';
import { Utils } from '../shared/support/support';
import { AggregateReportOrganizationService } from './aggregate-report-organization.service';
import { ranking } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { map } from 'rxjs/operators';
import { SubgroupFilters, SubgroupFilterSupport } from './subgroup/subgroup-filters';
import {Claim, Subject} from './aggregate-report-options.service';
import { AggregateReportService } from './aggregate-report.service';

const equalSize = (a: any[], b: any[]) => Utils.hasEqualLength(a, b);
const idsOf = values => values.map(value => value.id);
const hasOption = (options: any[], value) => options.find(option => option === value) != null;
const notNullOrEmpty = (value) => !Utils.isNullOrEmpty(value);

/**
 * Responsible for creating aggregate report requests from supplied models
 */
@Injectable()
export class AggregateReportRequestMapper {

  constructor(private translate: TranslateService,
              private organizationService: AggregateReportOrganizationService,
              private reportService: AggregateReportService) {
  }

  /**
   * Creates an aggregate report request form the given options and settings tailored to optimize backend performance
   *
   * @param {AggregateReportFormOptions} options the available report options
   * @param {AggregateReportFormSettings} settings the aggregate report form state
   * @param {AssessmentDefinition} assessmentDefinition
   * @returns {AggregateReportRequest}
   */
  map(options: AggregateReportFormOptions,
      settings: AggregateReportFormSettings,
      assessmentDefinition: AssessmentDefinition): AggregateReportRequest {

    const performanceLevelDisplayType = assessmentDefinition.performanceLevelDisplayTypes.includes(settings.performanceLevelDisplayType)
      ? settings.performanceLevelDisplayType
      : assessmentDefinition.performanceLevelDisplayTypes[ 0 ];

    const query: any = {
      achievementLevelDisplayType: performanceLevelDisplayType,
      assessmentTypeCode: settings.assessmentType,
      dimensionTypes: settings.dimensionTypes,
      includeAllDistricts: settings.includeAllDistricts,
      includeAllDistrictsOfSchools: settings.includeAllDistrictsOfSelectedSchools,
      includeAllSchoolsOfDistricts: settings.includeAllSchoolsOfSelectedDistricts,
      includeState: settings.includeStateResults && assessmentDefinition.aggregateReportStateResultsEnabled,
      reportType: this.toServerReportType(settings.reportType),
      valueDisplayType: settings.valueDisplayType,
      columnOrder: settings.columnOrder
    };

    if (assessmentDefinition.interim) {
      if (!equalSize(settings.interimAdministrationConditions, options.interimAdministrationConditions)) {
        query.administrativeConditionCodes = settings.interimAdministrationConditions;
      }
    } else {
      if (!equalSize(settings.summativeAdministrationConditions, options.summativeAdministrationConditions)) {
        query.administrativeConditionCodes = settings.summativeAdministrationConditions;
      }
    }

    if (!equalSize(settings.completenesses, options.completenesses)) {
      query.completenessCodes = settings.completenesses;
    }

    if (settings.districts.length) {
      query.districtIds = idsOf(settings.districts);
    }

    if (settings.schools.length) {
      query.schoolIds = idsOf(settings.schools);
    }

    // Set query type specific parameters
    if (settings.queryType === 'Basic') {
      query.studentFilters = this.createStudentFilters(settings.studentFilters, options.studentFilters);
    } else if (settings.queryType === 'FilteredSubgroup') {
      query.subgroups = this.createSubgroups(settings.subgroups);
    }

    // Set report type specific parameters
    // The assessment definition check is tacked on because the form state can be set to longitudinal cohort
    // and then the assessment definition can be changed to a type that does not support longitudinal cohort
    if (this.reportService.getEffectiveReportType(settings.reportType, assessmentDefinition) === AggregateReportType.GeneralPopulation) {
      query.assessmentGradeCodes = settings.generalPopulation.assessmentGrades;
      query.schoolYears = settings.generalPopulation.schoolYears;
      query.subjectCodes = settings.subjects.map(subject => subject.code);
    } else if (this.reportService.getEffectiveReportType(settings.reportType, assessmentDefinition) === AggregateReportType.LongitudinalCohort) {
      query.assessmentGradeCodes = settings.longitudinalCohort.assessmentGrades;
      query.toSchoolYear = settings.longitudinalCohort.toSchoolYear;
      query.subjectCodes = settings.subjects.map(subject => subject.code);
    } else if (this.reportService.getEffectiveReportType(settings.reportType, assessmentDefinition) === AggregateReportType.Claim) {
      query.assessmentGradeCodes = settings.claimReport.assessmentGrades;
      query.schoolYears = settings.claimReport.schoolYears;
      query.claimCodesBySubject = this.claimsBySubjectMapping(
        settings.subjects.map(subject => subject.code),
        settings.claimReport.claimCodesBySubject
      );
    } else if (this.reportService.getEffectiveReportType(settings.reportType, assessmentDefinition) === AggregateReportType.Target) {
      query.schoolYear = settings.targetReport.schoolYear;
      query.subjectCode = settings.targetReport.subjectCode;
      query.assessmentGradeCodes = [settings.targetReport.assessmentGrade];
    }

    const name = settings.name
      ? settings.name
      : this.translate.instant('aggregate-report-form.default-report-name');

    return {
      name: name,
      query: query
    };
  }

  toSettings(request: AggregateReportRequest, options: AggregateReportOptions): Observable<AggregateReportFormSettings> {

    const query: AggregateReportQuery = request.query;
    const queryType: string = request.query.subgroups ? 'FilteredSubgroup' : 'Basic';
    const reportType: AggregateReportType = this.fromServerReportType(request.query.reportType);
    const filters: StudentFilters = query.studentFilters || {};

    const queryInterimAdministrationConditions = (query.administrativeConditionCodes || [])
      .filter(code => hasOption(options.interimAdministrationConditions, code));

    const querySummativeAdministrationConditions = (query.administrativeConditionCodes || [])
      .filter(code => hasOption(options.summativeAdministrationConditions, code));

    const schoolIds: number[] = request.query.schoolIds;
    const schools: Observable<School[]> = !Utils.isNullOrEmpty(schoolIds)
      ? this.organizationService.getOrganizationsByIdAndType(OrganizationType.School, schoolIds)
      : of([]);

    const districtIds: number[] = request.query.districtIds;
    const districts: Observable<District[]> = !Utils.isNullOrEmpty(districtIds)
      ? this.organizationService.getOrganizationsByIdAndType(OrganizationType.District, districtIds)
      : of([]);

    // Returns the first argument that is not null or empty
    const or = (a: any, b: any) => Utils.isNullOrEmpty(a) ? b : a;

    console.log("options", options);

    // Safely sorts the provided values ranked by the provided options
    const sort = (values: any[], options: any[]) => (values || []).sort(ordering(ranking(options)).compare);

    const studentFilters = queryType === 'Basic'
      ? {
        economicDisadvantages: or(
          sort(filters.economicDisadvantageCodes, options.studentFilters.economicDisadvantages),
          options.studentFilters.economicDisadvantages
        ),
        ethnicities: or(
          sort(filters.ethnicityCodes, options.studentFilters.ethnicities),
          options.studentFilters.ethnicities
        ),
        genders: or(
          sort(filters.genderCodes, options.studentFilters.genders),
          options.studentFilters.genders
        ),
        individualEducationPlans: or(
          sort(filters.iepCodes, options.studentFilters.individualEducationPlans),
          options.studentFilters.individualEducationPlans
        ),
        limitedEnglishProficiencies: or(
          sort(filters.lepCodes, options.studentFilters.individualEducationPlans),
          options.studentFilters.individualEducationPlans
        ),
        englishLanguageAcquisitionStatuses: or(
          sort(filters.elasCodes, options.studentFilters.englishLanguageAcquisitionStatuses),
          options.studentFilters.englishLanguageAcquisitionStatuses
        ),
        migrantStatuses: or(
          sort(filters.migrantStatusCodes, options.studentFilters.migrantStatuses),
          options.studentFilters.migrantStatuses
        ),
        section504s: or(
          sort(filters.section504Codes, options.studentFilters.section504s),
          options.studentFilters.section504s
        ),
        languages: or(
          sort(filters.languageCodes, options.studentFilters.languages),
          options.studentFilters.languages
        ),
        militaryConnectedCodes: or(
          sort(filters.militaryConnectedCodes, options.studentFilters.militaryConnectedCodes),
          options.studentFilters.militaryConnectedCodes
        )
      }
      : SubgroupFilterSupport.copy(options.studentFilters);

    const subgroups = queryType === 'FilteredSubgroup'
      ? this.createSubgroupFiltersFromSubgroups(query.subgroups)
      : [];

    const defaultGeneralPopulation = {
      assessmentGrades: [],
      schoolYears: [ options.schoolYears[ 0 ] ]
    };

    const defaultClaimReport = {
      assessmentGrades: [],
      schoolYears: [ options.schoolYears[ 0 ] ],
      claimCodesBySubject: []
    };

    const defaultLongitudinalCohort = {
      assessmentGrades: [],
      toSchoolYear: options.schoolYears[ 0 ]
    };

    const defaultTargetReport = {
      assessmentGrade: options.assessmentGrades[ 0 ],
      schoolYear: options.schoolYears[ 0 ],
      subjectCode: options.subjects[ 0 ].code
    };

    let generalPopulation = defaultGeneralPopulation,
      longitudinalCohort = defaultLongitudinalCohort,
      claimReport = defaultClaimReport,
      targetReport = defaultTargetReport;

    if (reportType === AggregateReportType.GeneralPopulation) {
      generalPopulation = {
        assessmentGrades: sort(query.assessmentGradeCodes, options.assessmentGrades),
        schoolYears: query.schoolYears.sort((a, b) => b - a),
      };
    } else if (reportType === AggregateReportType.LongitudinalCohort) {
      longitudinalCohort = {
        assessmentGrades: sort(query.assessmentGradeCodes, options.assessmentGrades),
        toSchoolYear: query.toSchoolYear
      };
    } else if (reportType === AggregateReportType.Claim) {
      claimReport = {
        assessmentGrades: sort(query.assessmentGradeCodes, options.assessmentGrades),
        schoolYears: query.schoolYears.sort((a, b) => b - a),
        claimCodesBySubject: this.getClaims(query.assessmentTypeCode, options.claims, query.claimCodesBySubject)
      };
    } else if (reportType === AggregateReportType.Target) {
      targetReport = {
        assessmentGrade: or(
          query.assessmentGradeCodes,
          [ defaultTargetReport.assessmentGrade ]
        )[ 0 ],
        schoolYear: or(
          query.schoolYear,
          defaultTargetReport.schoolYear
        ),
        subjectCode: or(
          query.subjectCode,
          defaultTargetReport.subjectCode
        )
      }
    }

    return forkJoin(schools, districts)
      .pipe(
        map(([ schools, districts ]) => {
          return <AggregateReportFormSettings>{
            assessmentType: query.assessmentTypeCode,
            columnOrder: query.columnOrder,
            completenesses: or(
              sort(query.completenessCodes, options.completenesses),
              options.completenesses
            ),
            dimensionTypes: or(
              sort(query.dimensionTypes, options.dimensionTypes),
              []
            ),
            districts: districts,
            includeAllDistricts: query.includeAllDistricts,
            includeAllDistrictsOfSelectedSchools: query.includeAllDistrictsOfSchools,
            includeAllSchoolsOfSelectedDistricts: query.includeAllSchoolsOfDistricts,
            includeStateResults: query.includeState,
            interimAdministrationConditions: !queryInterimAdministrationConditions.length
              ? options.interimAdministrationConditions
              : queryInterimAdministrationConditions,
            name: request.name,
            performanceLevelDisplayType: query.achievementLevelDisplayType,
            queryType: queryType,
            reportType: reportType,
            schools: schools,
            studentFilters: studentFilters,
            subjects: sort(query.subjectCodes ? query.subjectCodes.map(code =>
              ({
                code: code,
                assessmentType: query.assessmentTypeCode
              })) : options.subjects, options.subjects),
            subgroups: subgroups,
            summativeAdministrationConditions: !querySummativeAdministrationConditions.length
              ? options.summativeAdministrationConditions
              : querySummativeAdministrationConditions,
            valueDisplayType: query.valueDisplayType,
            generalPopulation: generalPopulation,
            longitudinalCohort: longitudinalCohort,
            claimReport: claimReport,
            targetReport: targetReport
          };
        })
      );
  }

  private getClaims(assessmentType: string, claimOptions: Claim[], selectedClaims: any): Claim[] {
    const claims: Claim[] = [];
    for (const subject in selectedClaims) {
      if (selectedClaims[ subject ].length) {
        claims.push(...claimOptions.filter(claimOption => claimOption.assessmentType === assessmentType
          && claimOption.subject === subject
          && selectedClaims[ subject ].includes(claimOption.code)));
      } else {
        claims.push(...claimOptions.filter(claimOption => claimOption.assessmentType === assessmentType
          && claimOption.subject === subject));
      }
    }
    return claims;
  }

  private createStudentFilters(settingFilters, optionFilters): StudentFilters {
    const queryFilters: any = {};
    if (!equalSize(settingFilters.economicDisadvantages, optionFilters.economicDisadvantages)) {
      queryFilters.economicDisadvantageCodes = settingFilters.economicDisadvantages;
    }
    if (!equalSize(settingFilters.ethnicities, optionFilters.ethnicities)) {
      queryFilters.ethnicityCodes = settingFilters.ethnicities;
    }
    if (!equalSize(settingFilters.genders, optionFilters.genders)) {
      queryFilters.genderCodes = settingFilters.genders;
    }
    if (!equalSize(settingFilters.individualEducationPlans, optionFilters.individualEducationPlans)) {
      queryFilters.iepCodes = settingFilters.individualEducationPlans;
    }
    if (!equalSize(settingFilters.limitedEnglishProficiencies, optionFilters.limitedEnglishProficiencies)) {
      queryFilters.lepCodes = settingFilters.limitedEnglishProficiencies;
    }
    if (!equalSize(settingFilters.englishLanguageAcquisitionStatuses, optionFilters.englishLanguageAcquisitionStatuses)) {
      queryFilters.elasCodes = settingFilters.englishLanguageAcquisitionStatuses;
    }
    if (!equalSize(settingFilters.migrantStatuses, optionFilters.migrantStatuses)) {
      queryFilters.migrantStatusCodes = settingFilters.migrantStatuses;
    }
    if (!equalSize(settingFilters.section504s, optionFilters.section504s)) {
      queryFilters.section504Codes = settingFilters.section504s;
    }
    if (!equalSize(settingFilters.languages, optionFilters.languages)) {
      queryFilters.languageCodes = settingFilters.languages;
    }
    if (!equalSize(settingFilters.militaryConnectedCodes, optionFilters.militaryConnectedCodes)) {
      queryFilters.militaryConnectedCodes = optionFilters.militaryConnectedCodes;
    }
    return queryFilters;
  }

  private createStudentFiltersFromSubgroup(settingFilters: SubgroupFilters): StudentFilters {

    const queryFilters: any = {};
    if (notNullOrEmpty(settingFilters.economicDisadvantages)) {
      queryFilters.economicDisadvantageCodes = settingFilters.economicDisadvantages;
    }
    if (notNullOrEmpty(settingFilters.ethnicities)) {
      queryFilters.ethnicityCodes = settingFilters.ethnicities;
    }
    if (notNullOrEmpty(settingFilters.genders)) {
      queryFilters.genderCodes = settingFilters.genders;
    }
    if (notNullOrEmpty(settingFilters.individualEducationPlans)) {
      queryFilters.iepCodes = settingFilters.individualEducationPlans;
    }
    if (notNullOrEmpty(settingFilters.limitedEnglishProficiencies)) {
      queryFilters.lepCodes = settingFilters.limitedEnglishProficiencies;
    }
    if (notNullOrEmpty(settingFilters.englishLanguageAcquisitionStatuses)) {
      queryFilters.elasCodes = settingFilters.englishLanguageAcquisitionStatuses;
    }
    if (notNullOrEmpty(settingFilters.migrantStatuses)) {
      queryFilters.migrantStatusCodes = settingFilters.migrantStatuses;
    }
    if (notNullOrEmpty(settingFilters.section504s)) {
      queryFilters.section504Codes = settingFilters.section504s;
    }
    if(notNullOrEmpty(settingFilters.languages)) {
      queryFilters.languageCodes = settingFilters.languages;
    }
    if(notNullOrEmpty(settingFilters.militaryConnectedCodes)) {
      queryFilters.militaryConnectedCodes = settingFilters.militaryConnectedCodes;
    }
    return queryFilters;
  }

  private createSubgroups(settingFilters: SubgroupFilters[]): { [ key: string ]: StudentFilters } {
    return settingFilters.reduce((subgroups, filters, index) => {
      subgroups[ (index + 1).toString() ] = this.createStudentFiltersFromSubgroup(filters);
      return subgroups;
    }, {});
  }

  private createSubgroupFiltersFromSubgroups(querySubgroups: { [ key: string ]: StudentFilters }): SubgroupFilters[] {
    return Object.values(querySubgroups) // This ignores the keys as we do not use them at the moment
      .map(subgroup => this.createSubgroupFilters(subgroup));
  }

  createSubgroupFilters(subgroup: StudentFilters): SubgroupFilters {
    const subgroupFilters: any = {};
    if (notNullOrEmpty(subgroup.economicDisadvantageCodes)) {
      subgroupFilters.economicDisadvantages = subgroup.economicDisadvantageCodes;
    }
    if (notNullOrEmpty(subgroup.ethnicityCodes)) {
      subgroupFilters.ethnicities = subgroup.ethnicityCodes;
    }
    if (notNullOrEmpty(subgroup.genderCodes)) {
      subgroupFilters.genders = subgroup.genderCodes;
    }
    if (notNullOrEmpty(subgroup.iepCodes)) {
      subgroupFilters.individualEducationPlans = subgroup.iepCodes;
    }
    if (notNullOrEmpty(subgroup.lepCodes)) {
      subgroupFilters.limitedEnglishProficiencies = subgroup.lepCodes;
    }
    if (notNullOrEmpty(subgroup.elasCodes)) {
      subgroupFilters.englishLanguageAcquisitionStatuses = subgroup.elasCodes;
    }
    if (notNullOrEmpty(subgroup.migrantStatusCodes)) {
      subgroupFilters.migrantStatuses = subgroup.migrantStatusCodes;
    }
    if (notNullOrEmpty(subgroup.section504Codes)) {
      subgroupFilters.section504s = subgroup.section504Codes;
    }
    if (notNullOrEmpty(subgroup.languageCodes)) {
      subgroupFilters.languages = subgroup.languageCodes;
    }
    if (notNullOrEmpty(subgroup.militaryConnectedCodes)) {
      subgroupFilters.militaryConnectedCodes = subgroup.militaryConnectedCodes;
    }
    return subgroupFilters;
  }

  // TODO consolidate type names to remove need for extra mapping

  private ServerReportTypeByClientType: Map<AggregateReportType, ServerAggregateReportType> = new Map([
    [AggregateReportType.GeneralPopulation, ServerAggregateReportType.CustomAggregate],
    [AggregateReportType.LongitudinalCohort, ServerAggregateReportType.Longitudinal],
    [AggregateReportType.Claim, ServerAggregateReportType.Claim],
    [AggregateReportType.Target, ServerAggregateReportType.Target]
  ]);

  private ClientReportTypeByServerType: Map<ServerAggregateReportType, AggregateReportType> = new Map([
    [ServerAggregateReportType.CustomAggregate, AggregateReportType.GeneralPopulation],
    [ServerAggregateReportType.Longitudinal, AggregateReportType.LongitudinalCohort],
    [ServerAggregateReportType.Claim, AggregateReportType.Claim],
    [ServerAggregateReportType.Target, AggregateReportType.Target]
  ]);

  private toServerReportType(type: AggregateReportType): ServerAggregateReportType {
    return this.ServerReportTypeByClientType.get(type);
  }

  private fromServerReportType(type: ServerAggregateReportType): AggregateReportType {
    return this.ClientReportTypeByServerType.get(type);
  }

  claimsBySubjectMapping(subjects: string[], claims: Claim[]) {
    const obj = {};
    for (const subject of subjects) {
      obj[ subject ] = [];
    }
    for (const claim of claims) {
      if (obj[ claim.subject ] != null) {
        obj[ claim.subject ].push(claim.code);
      }
    }
    return obj;
  }

}

export enum ServerAggregateReportType {
  CustomAggregate = 'CustomAggregate',
  Longitudinal = 'Longitudinal',
  Claim = 'Claim',
  Target = 'Target'
}
