import { Injectable } from "@angular/core";
import { AggregateReportQuery, AggregateReportRequest } from "../report/aggregate-report-request";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { TranslateService } from "@ngx-translate/core";
import { AssessmentDefinition } from "./assessment/assessment-definition";
import { AggregateReportOptions } from "./aggregate-report-options";
import { Observable } from "rxjs/Observable";
import { District, OrganizationType, School } from "../shared/organization/organization";
import { Utils } from "../shared/support/support";
import { AggregateReportOrganizationService } from "./aggregate-report-organization.service";
import { ranking } from "@kourge/ordering/comparator";
import { ordering } from "@kourge/ordering";
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

const equalSize = (a: any[], b: any[]) => a.length === b.length;
const idsOf = values => values.map(value => value.id);

const hasOption = (options: any[], value) => options.find(option => option === value) != null;

/**
 * Responsible for creating aggregate report requests from supplied models
 */
@Injectable()
export class AggregateReportRequestMapper {

  constructor(private translate: TranslateService,
              private organizationService: AggregateReportOrganizationService){
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

    const query: any = <AggregateReportQuery>{
      achievementLevelDisplayType: settings.performanceLevelDisplayType,
      assessmentTypeCode: settings.assessmentType,
      assessmentGradeCodes: settings.assessmentGrades,
      includeAllDistricts: settings.includeAllDistricts,
      includeAllDistrictsOfSchools: settings.includeAllDistrictsOfSelectedSchools,
      includeAllSchoolsOfDistricts: settings.includeAllSchoolsOfSelectedDistricts,
      includeState: settings.includeStateResults && settings.assessmentType == "sum",
      schoolYears: settings.schoolYears,
      subjectCodes: settings.subjects,
      dimensionTypes: settings.dimensionTypes,
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
    if (!equalSize(settings.economicDisadvantages, options.economicDisadvantages)) {
      query.economicDisadvantageCodes = settings.economicDisadvantages;
    }
    if (!equalSize(settings.ethnicities, options.ethnicities)) {
      query.ethnicityCodes = settings.ethnicities;
    }
    if (settings.districts.length) {
      query.districtIds = idsOf(settings.districts)
    }
    if (!equalSize(settings.genders, options.genders)) {
      query.genderCodes = settings.genders;
    }
    if (!equalSize(settings.individualEducationPlans, options.individualEducationPlans)) {
      query.iepCodes = settings.individualEducationPlans;
    }
    if (!equalSize(settings.limitedEnglishProficiencies, options.limitedEnglishProficiencies)) {
      query.lepCodes = settings.limitedEnglishProficiencies;
    }
    if (!equalSize(settings.migrantStatuses, options.migrantStatuses)) {
      query.migrantStatusCodes = settings.migrantStatuses;
    }
    if (!equalSize(settings.section504s, options.section504s)) {
      query.section504Codes = settings.section504s;
    }
    if (settings.schools.length) {
      query.schoolIds = idsOf(settings.schools)
    }

    const name = settings.name
      ? settings.name
      : this.translate.instant('aggregate-report-form.default-report-name');

    return {
      name: name,
      reportQuery: query
    }
  }

  toSettings(request: AggregateReportRequest, options: AggregateReportOptions): Observable<AggregateReportFormSettings> {

    const query: AggregateReportQuery = request.reportQuery;

    const queryInterimAdministrationConditions = (query.administrativeConditionCodes || [])
      .filter(code => hasOption(options.interimAdministrationConditions, code));

    const querySummativeAdministrationConditions = (query.administrativeConditionCodes || [])
      .filter(code => hasOption(options.summativeAdministrationConditions, code));

    const schoolIds: number[] = request.reportQuery.schoolIds;
    const schools: Observable<School[]> = !Utils.isNullOrEmpty(schoolIds)
      ? this.organizationService.getOrganizationsByIdAndType(OrganizationType.School, schoolIds)
      : of([]);

    const districtIds: number[] = request.reportQuery.districtIds;
    const districts: Observable<District[]> = !Utils.isNullOrEmpty(districtIds)
      ? this.organizationService.getOrganizationsByIdAndType(OrganizationType.District, districtIds)
      : of([]);

    // Returns the first argument that is not null or undefined
    const or = (a: any, b: any) => Utils.isNullOrEmpty(a) ? b : a;

    // Safely sorts the provided values ranked by the provided options
    const sort = (values: any[], options: any[]) => (values || []).sort(ordering(ranking(options)).compare);

    return forkJoin(schools, districts)
      .pipe(
        map(([ schools, districts ]) => {
          return <AggregateReportFormSettings>{
            assessmentType: query.assessmentTypeCode,
            assessmentGrades: sort(query.assessmentGradeCodes, options.assessmentGrades),
            completenesses: or(
              sort(query.completenessCodes, options.completenesses),
              options.completenesses
            ),
            dimensionTypes: or(
              sort(query.dimensionTypes, options.dimensionTypes),
              []
            ),
            districts: districts,
            economicDisadvantages: or(
              sort(query.economicDisadvantageCodes, options.economicDisadvantages),
              options.economicDisadvantages
            ),
            ethnicities: or(
              sort(query.ethnicityCodes, options.ethnicities),
              options.ethnicities
            ),
            genders: or(
              sort(query.genderCodes, options.genders),
              options.genders
            ),
            includeAllDistricts: query.includeAllDistricts,
            includeAllDistrictsOfSelectedSchools: query.includeAllDistrictsOfSchools,
            includeAllSchoolsOfSelectedDistricts: query.includeAllSchoolsOfDistricts,
            includeStateResults: query.includeState,
            individualEducationPlans: or(
              sort(query.iepCodes, options.individualEducationPlans),
              options.individualEducationPlans
            ),
            interimAdministrationConditions: !queryInterimAdministrationConditions.length
              ? options.interimAdministrationConditions
              : queryInterimAdministrationConditions,
            limitedEnglishProficiencies: or(
              sort(query.lepCodes, options.individualEducationPlans),
              options.individualEducationPlans
            ),
            migrantStatuses: or(
              sort(query.migrantStatusCodes, options.migrantStatuses),
              options.migrantStatuses
            ),
            name: request.name,
            performanceLevelDisplayType: query.achievementLevelDisplayType,
            section504s: or(
              sort(query.section504Codes, options.section504s),
              options.section504s
            ),
            summativeAdministrationConditions: !querySummativeAdministrationConditions.length
              ? options.summativeAdministrationConditions
              : querySummativeAdministrationConditions,
            schoolYears: query.schoolYears.sort((a, b) => b - a),
            schools: schools,
            subjects: sort(query.subjectCodes, options.subjects),
            valueDisplayType: query.valueDisplayType,
            columnOrder: request.reportQuery.columnOrder
          };
        })
      );
  }

}
