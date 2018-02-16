import { Injectable } from "@angular/core";
import { AggregateReportService } from "./aggregate-report.service";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { AggregateReportQuery, AggregateReportRequest } from "../report/aggregate-report-request";
import { Option } from "../shared/form/sb-checkbox-group.component";
import { District, OrganizationType, School } from "../shared/organization/organization";
import { AggregateReportOrganizationService } from "./aggregate-report-organization.service";
import { AggregateReportFormOptionsMapper } from "./aggregate-report-form-options.mapper";
import { Utils } from "../shared/support/support";
import { TranslateService } from "@ngx-translate/core";

const valuesOf = values => values.map(value => value.value);
const firstValueOf = values => values[ 0 ].value;
const hasOption = (options: Option[], value: any) => options.find(option => option.value === value) != null;

/**
 * This resolver is responsible for fetching an aggregate report based upon
 * an optional report id query parameter.
 */
@Injectable()
export class AggregateReportFormSettingsResolve implements Resolve<AggregateReportFormSettings> {

  constructor(private service: AggregateReportService,
              private optionMapper: AggregateReportFormOptionsMapper,
              private organizationService: AggregateReportOrganizationService,
              private translate: TranslateService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AggregateReportFormSettings> {
    const options: AggregateReportFormOptions = this.optionMapper.map(route.parent.data[ 'options' ]);
    const settings: AggregateReportFormSettings = this.createDefaultSettings(options);

    const reportId: string = route.queryParamMap.get('src');
    if (!reportId) {
      return Observable.of(settings);
    }

    //Fetch the report, lookup schools/districts, map to settings
    return this.service.getReportById(Number.parseInt(reportId))
      .flatMap(report => this.addOrganizations(report.request))
      .map(saturatedRequest => {
        this.mapOntoSettings(saturatedRequest, options, settings);
        return settings;
      })
  }

  /**
   * Creates the default/initial state of the aggregate report form based on the available options
   *
   * @param {AggregateReportFormOptions} options the options available for selection
   * @returns {AggregateReportFormSettings} the initial form state
   */
  private createDefaultSettings(options: AggregateReportFormOptions): AggregateReportFormSettings {
    return <AggregateReportFormSettings>{
      assessmentGrades: [],
      assessmentType: firstValueOf(options.assessmentTypes),
      completenesses: [ firstValueOf(options.completenesses) ],
      ethnicities: valuesOf(options.ethnicities),
      genders: valuesOf(options.genders),
      interimAdministrationConditions: [ firstValueOf(options.interimAdministrationConditions) ],
      schoolYears: [ firstValueOf(options.schoolYears) ],
      subjects: valuesOf(options.subjects),
      summativeAdministrationConditions: [ firstValueOf(options.summativeAdministrationConditions) ],
      migrantStatuses: valuesOf(options.migrantStatuses),
      individualEducationPlans: valuesOf(options.individualEducationPlans),
      section504s: valuesOf(options.section504s),
      limitedEnglishProficiencies: valuesOf(options.limitedEnglishProficiencies),
      economicDisadvantages: valuesOf(options.economicDisadvantages),
      performanceLevelDisplayType: firstValueOf(options.performanceLevelDisplayTypes),
      valueDisplayType: firstValueOf(options.valueDisplayTypes),
      dimensionTypes: [],
      includeStateResults: true,
      includeAllDistricts: false,
      includeAllSchoolsOfSelectedDistricts: false,
      includeAllDistrictsOfSelectedSchools: true,
      districts: [],
      schools: []
    };
  }

  private addOrganizations(request: AggregateReportRequest): Observable<SaturatedRequest> {
    const schoolIds: number[] = request.reportQuery.schoolIds;
    const schools: Observable<School[]> = !Utils.isNullOrEmpty(schoolIds)
      ? this.organizationService.getOrganizationsByIdAndType(OrganizationType.School, schoolIds)
      : Observable.of([]);

    const districtIds: number[] = request.reportQuery.districtIds;
    const districts: Observable<District[]> = !Utils.isNullOrEmpty(districtIds)
      ? this.organizationService.getOrganizationsByIdAndType(OrganizationType.District, districtIds)
      : Observable.of([]);

    return Observable.forkJoin(schools, districts)
      .map((results) => {
        const [ schools, districts ] = results;
        return {
          request: request,
          schools: schools,
          districts: districts
        };
      });
  }

  private mapOntoSettings(saturatedRequest: SaturatedRequest, options: AggregateReportFormOptions, settings: AggregateReportFormSettings): void {
    const request: AggregateReportRequest = saturatedRequest.request;
    const query: AggregateReportQuery = request.reportQuery;
    settings.performanceLevelDisplayType = query.achievementLevelDisplayType;
    settings.assessmentType = query.assessmentTypeCode;
    settings.assessmentGrades = query.assessmentGradeCodes;
    settings.dimensionTypes = query.dimensionTypes;
    settings.includeAllDistricts = query.includeAllDistricts;
    settings.includeAllDistrictsOfSelectedSchools = query.includeAllDistrictsOfSchools;
    settings.includeAllSchoolsOfSelectedDistricts = query.includeAllSchoolsOfDistricts;
    settings.includeStateResults = query.includeState;
    settings.schoolYears = query.schoolYears;
    settings.subjects = query.subjectCodes;
    settings.valueDisplayType = query.valueDisplayType;

    settings.completenesses = Utils.isNullOrEmpty(query.completenessCodes)
      ? valuesOf(options.completenesses)
      : query.completenessCodes;

    settings.economicDisadvantages = Utils.isNullOrEmpty(query.economicDisadvantageCodes)
      ? valuesOf(options.economicDisadvantages)
      : query.economicDisadvantageCodes;

    settings.ethnicities = Utils.isNullOrEmpty(query.ethnicityCodes)
      ? valuesOf(options.ethnicities)
      : query.ethnicityCodes;

    settings.genders = Utils.isNullOrEmpty(query.genderCodes)
      ? valuesOf(options.genders)
      : query.genderCodes;

    settings.individualEducationPlans = Utils.isNullOrEmpty(query.iepCodes)
      ? valuesOf(options.individualEducationPlans)
      : query.iepCodes;

    settings.limitedEnglishProficiencies = Utils.isNullOrEmpty(query.lepCodes)
      ? valuesOf(options.individualEducationPlans)
      : query.lepCodes;

    settings.migrantStatuses = Utils.isNullOrEmpty(query.migrantStatusCodes)
      ? valuesOf(options.migrantStatuses)
      : query.migrantStatusCodes;

    settings.section504s = Utils.isNullOrEmpty(query.section504Codes)
      ? valuesOf(options.section504s)
      : query.section504Codes;

    const queryInterimAdministrationConditions = query.administrativeConditionCodes
      .filter(code => hasOption(options.interimAdministrationConditions, code));

    settings.interimAdministrationConditions = queryInterimAdministrationConditions.length
      ? queryInterimAdministrationConditions
      : valuesOf(options.interimAdministrationConditions);

    const querySummativeAdministrationConditions = query.administrativeConditionCodes
      .filter(code => hasOption(options.summativeAdministrationConditions, code));

    settings.summativeAdministrationConditions = querySummativeAdministrationConditions.length
      ? querySummativeAdministrationConditions
      : valuesOf(options.interimAdministrationConditions);


    if (!Utils.isNullOrEmpty(saturatedRequest.districts)) {
      settings.districts = saturatedRequest.districts;
    }

    if (!Utils.isNullOrEmpty(saturatedRequest.schools)) {
      settings.schools = saturatedRequest.schools;
    }

    settings.name = `${request.name} ${this.translate.instant('common.copy-suffix')}`;
  }

}

interface SaturatedRequest {
  readonly request: AggregateReportRequest;
  readonly schools: School[];
  readonly districts: District[];
}

