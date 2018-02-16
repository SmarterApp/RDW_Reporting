import { AggregateReportFormSettingsResolve } from "./aggregate-report-form-settings.resolve";
import { AggregateReportService } from "./aggregate-report.service";
import { AggregateReportFormOptionsMapper } from "./aggregate-report-form-options.mapper";
import { AggregateReportOrganizationService } from "./aggregate-report-organization.service";
import { Report } from "../report/report.model";
import { Observable } from "rxjs/Observable";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import {
  DefaultDistrict,
  DefaultSchool,
  District,
  OrganizationType,
  School
} from "../shared/organization/organization";
import { inject, TestBed } from "@angular/core/testing";
import { AggregateReportQuery, AggregateReportRequest } from "../report/aggregate-report-request";
import { Option as SbToggleOption } from "../shared/sb-toggle.component";
import { Option as SbCheckboxGroupOption } from "../shared/form/sb-checkbox-group.component";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import Spy = jasmine.Spy;
import { TranslateService } from "@ngx-translate/core";

describe('AggregateReportFormSettingsResolve', () => {
  let reportService: AggregateReportService;
  let optionMapper: AggregateReportFormOptionsMapper;
  let organizationService: AggregateReportOrganizationService;
  let translateService: TranslateService;
  let resolve: AggregateReportFormSettingsResolve;
  let route: ActivatedRouteSnapshot;
  let report: Report;
  let options: AggregateReportFormOptions;
  let district: District;
  let school: School;
  let reportName: string = 'report name';

  beforeEach(() => {
    route = mockRoute();
    report = mockReport();
    district = mockDistrict();
    school = mockSchool();
    options = mockOptions();

    reportService = jasmine.createSpyObj(
      "ReportService",
      [ "getReportById" ]
    );
    (reportService.getReportById as Spy).and.callFake(() => Observable.of(report));

    optionMapper = jasmine.createSpyObj(
      "AggregateReportFormOptionsMapper",
      [ "map" ]
    );
    (optionMapper.map as Spy).and.callFake(() => options);

    organizationService = jasmine.createSpyObj(
      "AggregateReportOrganizationService",
      [ "getOrganizationsByIdAndType" ]
    );
    (organizationService.getOrganizationsByIdAndType as Spy).and
      .callFake((type: OrganizationType) => {
        if (type == OrganizationType.District) {
          return Observable.of([district]);
        }
        if (type == OrganizationType.School) {
          return Observable.of([school]);
        }
      });

    translateService = jasmine.createSpyObj(
      "TranslateService",
      [ "instant" ]
    );
    (translateService.instant as Spy).and.callFake(() => reportName);

    TestBed.configureTestingModule({
      providers: [
        AggregateReportFormSettingsResolve,
        { provide: AggregateReportService, useValue: reportService },
        { provide: AggregateReportFormOptionsMapper, useValue: optionMapper },
        { provide: AggregateReportOrganizationService, useValue: organizationService },
        { provide: TranslateService, useValue: translateService }
      ]
    });
  });

  beforeEach(inject([ AggregateReportFormSettingsResolve ], (injectedSvc: AggregateReportFormSettingsResolve) => {
    resolve = injectedSvc;
  }));

  it('should create', () => {
    expect(resolve).toBeTruthy();
  });

  it('should map a report to settings', (done) =>{
    const query = report.request.reportQuery;
    resolve.resolve(route as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      .subscribe((settings: AggregateReportFormSettings) => {

        expect(settings.assessmentGrades).toEqual(query.assessmentGradeCodes);
        expect(settings.assessmentType).toEqual(query.assessmentTypeCode);
        expect(settings.completenesses).toEqual(query.completenessCodes);
        expect(settings.economicDisadvantages).toEqual(query.economicDisadvantageCodes);
        expect(settings.ethnicities).toEqual(query.ethnicityCodes);
        expect(settings.dimensionTypes).toEqual(query.dimensionTypes);
        expect(settings.genders).toEqual(query.genderCodes);
        expect(settings.individualEducationPlans).toEqual(query.iepCodes);
        expect(settings.interimAdministrationConditions).toEqual(["SD"]);
        expect(settings.limitedEnglishProficiencies).toEqual(query.lepCodes);
        expect(settings.migrantStatuses).toEqual(query.migrantStatusCodes);
        expect(settings.performanceLevelDisplayType).toEqual(query.achievementLevelDisplayType);
        expect(settings.section504s).toEqual(query.section504Codes);
        expect(settings.schoolYears).toEqual(query.schoolYears);
        expect(settings.subjects).toEqual(query.subjectCodes);
        expect(settings.summativeAdministrationConditions).toEqual(["Valid"]);
        expect(settings.valueDisplayType).toEqual(query.valueDisplayType);
        expect(settings.includeStateResults).toEqual(query.includeState);
        expect(settings.includeAllDistricts).toEqual(query.includeAllDistricts);
        expect(settings.includeAllSchoolsOfSelectedDistricts).toEqual(query.includeAllSchoolsOfDistricts);
        expect(settings.includeAllDistrictsOfSelectedSchools).toEqual(query.includeAllDistrictsOfSchools);
        expect(settings.districts).toEqual([district]);
        expect(settings.schools).toEqual([school]);

        expect(reportService.getReportById).toHaveBeenCalledWith(123);
        expect(optionMapper.map).toHaveBeenCalledWith(route.parent.data.options);
        expect(organizationService.getOrganizationsByIdAndType)
          .toHaveBeenCalledWith(OrganizationType.School, [2]);
        expect(organizationService.getOrganizationsByIdAndType)
          .toHaveBeenCalledWith(OrganizationType.District, [1]);
        done();
      });
  });

  function mockReport(): Report {
    const query: AggregateReportQuery = {
      achievementLevelDisplayType: 'Separate',
      administrativeConditionCodes: ['Valid','SD'],
      assessmentGradeCodes: ['03', '04'],
      assessmentTypeCode: 'ica',
      completenessCodes: ['Complete'],
      economicDisadvantageCodes: ['yes'],
      ethnicityCodes: ['Asian', 'White', 'HispanicOrLatinoEthnicity'],
      dimensionTypes: ['Gender'],
      districtIds: [1],
      genderCodes: ["Female"],
      iepCodes: ['yes'],
      includeAllDistricts: false,
      includeAllDistrictsOfSchools: true,
      includeAllSchoolsOfDistricts: true,
      includeState: true,
      lepCodes: ['yes'],
      migrantStatusCodes: ['yes'],
      section504Codes: ['yes'],
      schoolIds: [2],
      schoolYears: [1999],
      subjectCodes: ['Math'],
      valueDisplayType: 'Number'
    };

    const request: AggregateReportRequest = {
      name: 'My Report',
      reportQuery: query
    };

    const report: Report = new Report();
    report.id = 123;
    report.request = request;
    return report;
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

  function mockOptions(): AggregateReportFormOptions {

    return {
      assessmentGrades: [
        asCBOption("03"),
        asCBOption("04"),
        asCBOption("05"),
        asCBOption("06"),
        asCBOption("07"),
        asCBOption("08"),
        asCBOption("11")
        ],
      assessmentTypes: [
        asTGOption("ica"),
        asTGOption("iab"),
        asTGOption("sum")
        ],
      completenesses: [
        asCBOption("Complete"),
        asCBOption("Partial")
        ],
      dimensionTypes: [
        asCBOption("Gender"),
        asCBOption("Ethnicity")
        ],
      economicDisadvantages: [
        asCBOption("yes"),
        asCBOption("no")
        ],
      ethnicities: [
        asCBOption("AmericanIndianOrAlaskaNative"),
        asCBOption("Asian"),
        asCBOption("BlackOrAfricanAmerican"),
        asCBOption("DemographicRaceTwoOrMoreRaces"),
        asCBOption("Filipino"),
        asCBOption("HispanicOrLatinoEthnicity"),
        asCBOption("NativeHawaiianOrOtherPacificIslander"),
        asCBOption("White")
        ],
      genders: [
        asCBOption("Male"),
        asCBOption("Female")
      ],
      individualEducationPlans: [
        asCBOption("yes"),
        asCBOption("no")
      ],
      interimAdministrationConditions: [
        asCBOption("SD"),
        asCBOption("NS")
      ],
      limitedEnglishProficiencies: [
        asCBOption("yes"),
        asCBOption("no")
      ],
      migrantStatuses: [
        asCBOption("yes"),
        asCBOption("no")
      ],
      performanceLevelDisplayTypes: [
        asTGOption("Separate"),
        asTGOption("Grouped")
      ],
      section504s: [
        asCBOption("yes"),
        asCBOption("no")
      ],
      schoolYears: [
        asCBOption(1999),
        asCBOption(2000)
      ],
      statewideReporter: false,
      subjects: [
        asCBOption("Math"),
        asCBOption("ELA")
      ],
      summativeAdministrationConditions: [
        asCBOption("Valid"),
        asCBOption("IN")
      ],
      valueDisplayTypes: [
        asCBOption("Number"),
        asCBOption("Percent")
      ]
    };
  }

  function asCBOption(value: any): SbCheckboxGroupOption {
    return {
      value: value,
      text: value.toString()
    };
  }

  function asTGOption(value: any): SbToggleOption {
    return {
      value: value,
      text: value.toString()
    };
  }

  function mockRoute(): ActivatedRouteSnapshot {
    const paramMap: Map<string, any> = new Map();
    paramMap.set("src", 123);

    return {
      parent: {
        data: {
          options: "rawOptions"
        }
      },
      queryParamMap: paramMap
    } as any;
  }
});
