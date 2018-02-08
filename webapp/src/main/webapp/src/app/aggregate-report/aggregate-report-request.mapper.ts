import { Injectable } from "@angular/core";
import { AggregateReportQuery, AggregateReportRequest } from "../report/aggregate-report-request";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";

const equalSize = (a: any[], b: any[]) => a.length === b.length;
const idsOf = values => values.map(value => value.id);

/**
 * Responsible for creating aggregate report requests from supplied models
 */
@Injectable()
export class AggregateReportRequestMapper {

  /**
   * Creates an aggregate report request form the given options and settings tailored to optimize backend performance
   *
   * @param {AggregateReportFormOptions} options the available report options
   * @param {AggregateReportFormSettings} settings the aggregate report form state
   * @returns {AggregateReportRequest}
   */
  map(options: AggregateReportFormOptions, settings: AggregateReportFormSettings): AggregateReportRequest {
    const query: any = <AggregateReportQuery>{
      achievementLevelDisplayType: settings.performanceLevelDisplayType,
      assessmentTypeCode: settings.assessmentType,
      assessmentGradeCodes: settings.assessmentGrades,
      dimensionTypes: settings.dimensionTypes,
      includeAllDistricts: settings.includeAllDistricts,
      includeAllDistrictsOfSchools: settings.includeAllDistrictsOfSelectedSchools,
      includeAllSchoolsOfDistricts: settings.includeAllSchoolsOfSelectedDistricts,
      includeState: settings.includeStateResults,
      schoolYears: settings.schoolYears,
      subjectCodes: settings.subjects,
      valueDisplayType: settings.valueDisplayType
    };

    if (!equalSize(settings.interimAdministrationConditions, options.interimAdministrationConditions)
      || !equalSize(settings.summativeAdministrationConditions, options.summativeAdministrationConditions)) {
      query.administrationConditionCodes = settings.interimAdministrationConditions
        .concat(settings.summativeAdministrationConditions);
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
    if (!equalSize(settings.section504s, options.section504s)) {
      query.section504Codes = settings.section504s;
    }
    if (settings.schools.length) {
      query.schoolIds = idsOf(settings.schools)
    }
    return {
      name: 'Custom Aggregate Report', // TODO add form field for name
      reportQuery: query
    }
  }

}
