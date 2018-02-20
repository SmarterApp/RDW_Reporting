import { AggregateReportRequestMapper } from "./aggregate-report-request.mapper";
import { TranslateService } from "@ngx-translate/core";
import { AggregateReportOrganizationService } from "./aggregate-report-organization.service";
import {
  DefaultDistrict,
  DefaultSchool,
  District,
  OrganizationType,
  School
} from "../shared/organization/organization";
import { Observable } from "rxjs/Observable";
import { AggregateReportOptions } from "./aggregate-report-options";
import { AggregateReportQuery, AggregateReportRequest } from "../report/aggregate-report-request";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { DefaultColumnOrder } from "./aggregate-report-options.mapper";
import Spy = jasmine.Spy;

describe('AggregateReportRequestMapper', () => {

  const translateService = jasmine.createSpyObj('TranslateService', [
    'instant'
  ]);

  const organizationService = jasmine.createSpyObj('AggregateReportOrganizationService', [
    'getOrganizationsByIdAndType'
  ]);

  const fixture: AggregateReportRequestMapper = new AggregateReportRequestMapper(translateService, organizationService);

  it('toSettings should map a request to settings', () => {

    const schools = [ mockSchool() ];
    const districts = [ mockDistrict() ];

    (organizationService.getOrganizationsByIdAndType as Spy).and
      .callFake((type: OrganizationType) => {
        if (type === OrganizationType.District) {
          return Observable.of(districts);
        }
        if (type === OrganizationType.School) {
          return Observable.of(schools);
        }
      });

    const query: AggregateReportQuery = {
      achievementLevelDisplayType: 'Separate',
      administrativeConditionCodes: [ 'Valid', 'SD' ],
      assessmentGradeCodes: [ '03', '04' ],
      assessmentTypeCode: 'ica',
      completenessCodes: [ 'Complete' ],
      economicDisadvantageCodes: [ 'yes' ],
      ethnicityCodes: [ 'Asian', 'White' ],
      dimensionTypes: [ 'Gender' ],
      districtIds: [ 1 ],
      genderCodes: [ "Female" ],
      iepCodes: [ 'yes' ],
      includeAllDistricts: false,
      includeAllDistrictsOfSchools: true,
      includeAllSchoolsOfDistricts: true,
      includeState: true,
      lepCodes: [ 'yes' ],
      migrantStatusCodes: [ 'yes' ],
      section504Codes: [ 'yes' ],
      schoolIds: [ 2 ],
      schoolYears: [ 2000 ],
      subjectCodes: [ 'Math' ],
      valueDisplayType: 'Number',
      columnOrder: ['columnA', 'columnB']
    };

    const request: AggregateReportRequest = {
      name: 'Report Name',
      reportQuery: query
    };

    const expected: AggregateReportFormSettings = {
      performanceLevelDisplayType: query.achievementLevelDisplayType,
      interimAdministrationConditions: [ 'SD' ],
      summativeAdministrationConditions: [ 'Valid' ],
      assessmentGrades: query.assessmentGradeCodes,
      assessmentType: query.assessmentTypeCode,
      completenesses: query.completenessCodes,
      economicDisadvantages: query.economicDisadvantageCodes,
      ethnicities: query.ethnicityCodes,
      dimensionTypes: query.dimensionTypes,
      districts: districts,
      genders: query.genderCodes,
      individualEducationPlans: query.iepCodes,
      includeAllDistricts: query.includeAllDistricts,
      includeAllDistrictsOfSelectedSchools: query.includeAllDistrictsOfSchools,
      includeAllSchoolsOfSelectedDistricts: query.includeAllSchoolsOfDistricts,
      includeStateResults: query.includeState,
      limitedEnglishProficiencies: query.lepCodes,
      migrantStatuses: query.migrantStatusCodes,
      section504s: query.section504Codes,
      schools: schools,
      schoolYears: query.schoolYears,
      subjects: query.subjectCodes,
      valueDisplayType: query.valueDisplayType,
      name: request.name,
      columnOrder: ['columnA', 'columnB']
    };

    fixture.toSettings(request, mockOptions())
      .subscribe(actual => {
        expect(actual).toEqual(expected);
      });

  });

  it('toSettings should interpret missing optional fields on request as settings with all options selected', () => {

    const options = mockOptions();

    const query: AggregateReportQuery = {
      achievementLevelDisplayType: 'Separate',
      assessmentGradeCodes: [ '03' ],
      assessmentTypeCode: 'iab',
      includeAllDistricts: false,
      includeAllDistrictsOfSchools: true,
      includeAllSchoolsOfDistricts: true,
      includeState: true,
      schoolYears: [ 2000 ],
      subjectCodes: [ 'Math' ],
      valueDisplayType: 'Percent'
    };

    const request: AggregateReportRequest = {
      name: 'Report Name',
      reportQuery: query
    };

    const expected: AggregateReportFormSettings = {
      performanceLevelDisplayType: query.achievementLevelDisplayType,
      interimAdministrationConditions: options.interimAdministrationConditions,
      summativeAdministrationConditions: options.summativeAdministrationConditions,
      assessmentGrades: query.assessmentGradeCodes,
      assessmentType: query.assessmentTypeCode,
      completenesses: options.completenesses,
      economicDisadvantages: options.economicDisadvantages,
      ethnicities: options.ethnicities,
      dimensionTypes: [],
      districts: [],
      genders: options.genders,
      individualEducationPlans: options.individualEducationPlans,
      includeAllDistricts: query.includeAllDistricts,
      includeAllDistrictsOfSelectedSchools: query.includeAllDistrictsOfSchools,
      includeAllSchoolsOfSelectedDistricts: query.includeAllSchoolsOfDistricts,
      includeStateResults: query.includeState,
      limitedEnglishProficiencies: options.limitedEnglishProficiencies,
      migrantStatuses: options.migrantStatuses,
      section504s: options.section504s,
      schools: [],
      schoolYears: query.schoolYears,
      subjects: query.subjectCodes,
      valueDisplayType: query.valueDisplayType,
      name: request.name,
      columnOrder: DefaultColumnOrder
    };

    fixture.toSettings(request, options)
      .subscribe(actual => {
        expect(actual).toEqual(expected);
      });

  });

  function mockOptions(): AggregateReportOptions {
    const booleans = [ 'yes', 'no', 'undefined' ];
    const strictBooleans = [ 'yes', 'no' ];
    return {
      assessmentGrades: [ '03', '04', '05' ],
      assessmentTypes: [ 'ica', 'iab', 'sum' ],
      completenesses: [ 'Complete', 'Partial' ],
      dimensionTypes: [ 'Gender', 'Ethnicity' ],
      economicDisadvantages: strictBooleans,
      ethnicities: [ 'Asian', 'White' ],
      genders: [ 'Male', 'Female' ],
      individualEducationPlans: strictBooleans,
      interimAdministrationConditions: [ 'SD', 'NS' ],
      limitedEnglishProficiencies: strictBooleans,
      migrantStatuses: booleans,
      section504s: booleans,
      schoolYears: [ 2000, 1999 ],
      statewideReporter: false,
      subjects: [ 'Math', 'ELA' ],
      summativeAdministrationConditions: [ 'Valid', 'IN' ]
    }
  }

  function mockDistrict(): District {
    const district: DefaultDistrict = new DefaultDistrict();
    district.id = 1;
    district.name = "District 1";
    district.naturalId = "district_1";
    return district;
  }

  function mockSchool(): School {
    const school: DefaultSchool = new DefaultSchool();
    school.id = 2;
    school.name = "School 2";
    school.naturalId = "school_2";
    school.districtId = 1;
    return school;
  }

});
