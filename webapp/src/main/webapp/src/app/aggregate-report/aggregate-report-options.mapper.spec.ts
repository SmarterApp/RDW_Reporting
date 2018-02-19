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
import { AggregateReportOptionsMapper } from "./aggregate-report-options.mapper";
import Spy = jasmine.Spy;
import { PerformanceLevelDisplayTypes } from "../shared/display-options/performance-level-display-type";
import { ValueDisplayTypes } from "../shared/display-options/value-display-type";

describe('AggregateReportOptionsMapper', () => {

  let fixture: AggregateReportOptionsMapper;
  let translateService;
  let schoolYearPipe;
  let displayOptionService;

  beforeEach(() => {
    translateService = jasmine.createSpyObj('TranslateService', [
      'instant'
    ]);
    schoolYearPipe = jasmine.createSpyObj('SchoolYearPipe', [
      'transform'
    ]);
    displayOptionService = jasmine.createSpyObj('DisplayOptionService', [
      'getValueDisplayTypeOptions',
      'getPerformanceLevelDisplayTypeOptions',
      'createOptionMapper'
    ]);
    fixture = new AggregateReportOptionsMapper(translateService, schoolYearPipe, displayOptionService);
  })

  it('toDefaultSettings should create default settings correctly from options', () => {

    const reportName = 'Report Name';
    (translateService.instant as Spy).and.callFake(() => reportName);

    const options: AggregateReportOptions = {
      assessmentGrades: [ '1', '2'],
      assessmentTypes: [ '1', '2' ],
      completenesses: [ '1', '2' ],
      dimensionTypes: [ '1', '2' ],
      economicDisadvantages: [ '1', '2' ],
      ethnicities: [ '1', '2' ],
      genders: [ '1', '2' ],
      individualEducationPlans: [ '1', '2' ],
      interimAdministrationConditions: [ '1', '2' ],
      limitedEnglishProficiencies: [ '1', '2' ],
      migrantStatuses: [ '1', '2' ],
      section504s: [ '1', '2' ],
      schoolYears: [ 1, 2 ],
      statewideReporter: false,
      subjects: [ '1', '2' ],
      summativeAdministrationConditions: [ '1', '2' ]
    };

    expect(fixture.toDefaultSettings(options)).toEqual({
      performanceLevelDisplayType: PerformanceLevelDisplayTypes.Separate,
      interimAdministrationConditions: [options.interimAdministrationConditions[0]],
      summativeAdministrationConditions: [options.summativeAdministrationConditions[0]],
      assessmentGrades: [],
      assessmentType: options.assessmentTypes[0],
      completenesses: [ options.completenesses[0] ],
      economicDisadvantages: options.economicDisadvantages,
      ethnicities: options.ethnicities,
      dimensionTypes: [],
      districts: [],
      genders: options.genders,
      individualEducationPlans: options.individualEducationPlans,
      includeAllDistricts: false,
      includeAllDistrictsOfSelectedSchools: true,
      includeAllSchoolsOfSelectedDistricts: false,
      includeStateResults: true,
      limitedEnglishProficiencies: options.limitedEnglishProficiencies,
      migrantStatuses: options.migrantStatuses,
      section504s: options.section504s,
      schools: [],
      schoolYears: [options.schoolYears[0]],
      subjects: options.subjects,
      valueDisplayType: ValueDisplayTypes.Percent
    });

  });

});
