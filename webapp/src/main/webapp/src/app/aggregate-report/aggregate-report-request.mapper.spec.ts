import { AggregateReportRequestMapper } from './aggregate-report-request.mapper';
import { TranslateService } from '@ngx-translate/core';
import { AggregateReportOrganizationService } from './aggregate-report-organization.service';
import {
  DefaultDistrict,
  DefaultSchool,
  District,
  OrganizationType,
  School
} from '../shared/organization/organization';
import { AggregateReportOptions } from './aggregate-report-options';
import { StudentFilters } from '../report/aggregate-report-request';
import { AggregateReportFormSettings } from './aggregate-report-form-settings';
import { of } from 'rxjs';
import Spy = jasmine.Spy;
import { CustomAggregateReportQuery } from '../report/report';

describe('AggregateReportRequestMapper', () => {
  const translateService = jasmine.createSpyObj('TranslateService', [
    'instant'
  ]);

  const organizationService = jasmine.createSpyObj(
    'AggregateReportOrganizationService',
    ['getOrganizationsByIdAndType']
  );

  const reportService = jasmine.createSpyObj('AggregateReportService', [
    'getEffectiveReportType'
  ]);

  const fixture: AggregateReportRequestMapper = new AggregateReportRequestMapper(
    translateService,
    organizationService,
    reportService
  );

  it('toSettings should map a request to settings', () => {
    const options = mockOptions();
    const schools = [mockSchool()];
    const districts = [mockDistrict()];

    (organizationService.getOrganizationsByIdAndType as Spy).and.callFake(
      (type: OrganizationType) => {
        if (type === OrganizationType.District) {
          return of(districts);
        }
        if (type === OrganizationType.School) {
          return of(schools);
        }
      }
    );

    const studentFilters: StudentFilters = {
      economicDisadvantageCodes: ['yes'],
      ethnicityCodes: ['Asian', 'White'],
      genderCodes: ['Female'],
      iepCodes: ['yes'],
      lepCodes: ['yes'],
      elasCodes: ['EO'],
      migrantStatusCodes: ['yes'],
      section504Codes: ['yes'],
      languageCodes: ['ENG', 'SPA'],
      militaryConnectedCodes: ['NotMilitaryConnected', 'ActiveDuty']
    };

    const query: CustomAggregateReportQuery = {
      achievementLevelDisplayType: 'Separate',
      administrativeConditionCodes: ['Valid', 'SD'],
      assessmentGradeCodes: ['03', '04'],
      assessmentTypeCode: 'ica',
      completenessCodes: ['Complete'],
      dimensionTypes: ['Gender'],
      districtIds: [1],
      includeAllDistricts: false,
      includeAllDistrictsOfSchools: true,
      includeAllSchoolsOfDistricts: true,
      includeState: true,
      type: 'CustomAggregate',
      schoolIds: [2],
      schoolYears: [2000],
      showEmpty: true,
      studentFilters: studentFilters,
      subjectCodes: ['Math'],
      valueDisplayType: 'Number',
      columnOrder: ['columnA', 'columnB'],
      name: 'Report Name'
    };

    const expected: AggregateReportFormSettings = {
      performanceLevelDisplayType: query.achievementLevelDisplayType,
      interimAdministrationConditions: ['SD'],
      summativeAdministrationConditions: ['Valid'],
      assessmentType: query.assessmentTypeCode,
      completenesses: query.completenessCodes,
      dimensionTypes: query.dimensionTypes,
      districts: districts,
      includeAllDistricts: query.includeAllDistricts,
      includeAllDistrictsOfSelectedSchools: query.includeAllDistrictsOfSchools,
      includeAllSchoolsOfSelectedDistricts: query.includeAllSchoolsOfDistricts,
      includeStateResults: query.includeState,
      queryType: 'Basic',
      reportType: 'CustomAggregate',
      schools: schools,
      showEmpty: true,
      subjects: query.subjectCodes.map(code => ({
        code: code,
        assessmentType: query.assessmentTypeCode
      })),
      subgroups: [],
      valueDisplayType: query.valueDisplayType,
      name: query.name,
      columnOrder: ['columnA', 'columnB'],
      studentFilters: {
        economicDisadvantages: studentFilters.economicDisadvantageCodes,
        ethnicities: studentFilters.ethnicityCodes,
        genders: studentFilters.genderCodes,
        individualEducationPlans: studentFilters.iepCodes,
        limitedEnglishProficiencies: studentFilters.lepCodes,
        englishLanguageAcquisitionStatuses: studentFilters.elasCodes,
        migrantStatuses: studentFilters.migrantStatusCodes,
        section504s: studentFilters.section504Codes,
        languages: studentFilters.languageCodes,
        militaryConnectedCodes: studentFilters.militaryConnectedCodes
      },
      generalPopulation: {
        assessmentGrades: query.assessmentGradeCodes,
        schoolYears: query.schoolYears
      },
      claimReport: {
        assessmentGrades: [],
        schoolYears: query.schoolYears,
        claimCodesBySubject: []
      },
      altScoreReport: {
        assessmentGrades: [],
        schoolYears: query.schoolYears,
        altScoreCodesBySubject: []
      },
      longitudinalCohort: {
        assessmentGrades: [],
        toSchoolYear: options.schoolYears[0]
      },
      targetReport: {
        assessmentGrade: options.assessmentGrades[0],
        subjectCode: options.subjects[0].code,
        schoolYear: options.schoolYears[0]
      }
    };

    fixture.toSettings(query, options).subscribe(actual => {
      expect(actual).toEqual(expected);
    });
  });

  it('toSettings should interpret missing optional fields on request as settings with all options selected', () => {
    const options = mockOptions();

    const query: CustomAggregateReportQuery = {
      achievementLevelDisplayType: 'Separate',
      assessmentGradeCodes: ['03'],
      assessmentTypeCode: 'iab',
      includeAllDistricts: false,
      includeAllDistrictsOfSchools: true,
      includeAllSchoolsOfDistricts: true,
      includeState: true,
      type: 'CustomAggregate',
      schoolYears: [2000],
      showEmpty: true,
      studentFilters: {},
      subjectCodes: ['Math'],
      valueDisplayType: 'Percent',
      name: 'Report Name'
    };

    const expected: AggregateReportFormSettings = {
      performanceLevelDisplayType: query.achievementLevelDisplayType,
      interimAdministrationConditions: options.interimAdministrationConditions,
      summativeAdministrationConditions:
        options.summativeAdministrationConditions,
      assessmentType: query.assessmentTypeCode,
      completenesses: options.completenesses,
      dimensionTypes: [],
      districts: [],
      includeAllDistricts: query.includeAllDistricts,
      includeAllDistrictsOfSelectedSchools: query.includeAllDistrictsOfSchools,
      includeAllSchoolsOfSelectedDistricts: query.includeAllSchoolsOfDistricts,
      includeStateResults: query.includeState,
      queryType: 'Basic',
      reportType: 'CustomAggregate',
      schools: [],
      showEmpty: true,
      subjects: query.subjectCodes.map(code => ({
        code: code,
        assessmentType: query.assessmentTypeCode
      })),
      subgroups: [],
      valueDisplayType: query.valueDisplayType,
      name: query.name,
      columnOrder: query.columnOrder,
      studentFilters: {
        economicDisadvantages: options.studentFilters.economicDisadvantages,
        ethnicities: options.studentFilters.ethnicities,
        englishLanguageAcquisitionStatuses:
          options.studentFilters.englishLanguageAcquisitionStatuses,
        genders: options.studentFilters.genders,
        individualEducationPlans:
          options.studentFilters.individualEducationPlans,
        limitedEnglishProficiencies:
          options.studentFilters.limitedEnglishProficiencies,
        migrantStatuses: options.studentFilters.migrantStatuses,
        section504s: options.studentFilters.section504s,
        languages: options.studentFilters.languages,
        militaryConnectedCodes: options.studentFilters.militaryConnectedCodes
      },
      generalPopulation: {
        assessmentGrades: query.assessmentGradeCodes,
        schoolYears: query.schoolYears
      },
      claimReport: {
        assessmentGrades: [],
        schoolYears: query.schoolYears,
        claimCodesBySubject: []
      },
      altScoreReport: {
        assessmentGrades: [],
        schoolYears: query.schoolYears,
        altScoreCodesBySubject: []
      },
      longitudinalCohort: {
        assessmentGrades: [],
        toSchoolYear: options.schoolYears[0]
      },
      targetReport: {
        assessmentGrade: options.assessmentGrades[0],
        subjectCode: options.subjects[0].code,
        schoolYear: options.schoolYears[0]
      }
    };

    fixture.toSettings(query, options).subscribe(actual => {
      expect(actual).toEqual(expected);
    });
  });

  function mockOptions(): AggregateReportOptions {
    const booleans = ['yes', 'no', 'undefined'];
    const strictBooleans = ['yes', 'no'];
    return {
      assessmentGrades: ['03', '04', '05'],
      assessmentTypes: ['ica', 'iab', 'sum'],
      completenesses: ['Complete', 'Partial'],
      dimensionTypes: ['Gender', 'Ethnicity'],
      interimAdministrationConditions: ['SD', 'NS'],
      queryTypes: ['Basic', 'FilteredSubgroup'],
      reportTypes: [
        'CustomAggregate',
        'Longitudinal',
        'Claim',
        'AltScore',
        'Target'
      ],
      schoolYears: [2000, 1999],
      claims: [
        {
          subject: 'Math',
          assessmentType: 'ica',
          code: '3'
        },
        {
          subject: 'ELA',
          assessmentType: 'sum',
          code: '4'
        }
      ],
      altScores: [],
      statewideReporter: false,
      subjects: [
        {
          code: 'Math',
          assessmentType: 'iab'
        },
        {
          code: 'Math',
          assessmentType: 'ica'
        },
        {
          code: 'ELA',
          assessmentType: 'iab'
        }
      ],
      summativeAdministrationConditions: ['Valid', 'IN'],
      studentFilters: {
        economicDisadvantages: strictBooleans,
        ethnicities: ['Asian', 'White'],
        genders: ['Male', 'Female'],
        individualEducationPlans: strictBooleans,
        limitedEnglishProficiencies: strictBooleans,
        englishLanguageAcquisitionStatuses: ['EO'],
        migrantStatuses: booleans,
        section504s: booleans,
        languages: ['ENG', 'SPA'],
        militaryConnectedCodes: [
          'NotMilitaryConnected',
          'ActiveDuty',
          'NationalGuardOrReserve'
        ]
      }
    };
  }

  function mockDistrict(): District {
    const district: DefaultDistrict = new DefaultDistrict();
    district.id = 1;
    district.name = 'District 1';
    district.naturalId = 'district_1';
    return district;
  }

  function mockSchool(): School {
    const school: DefaultSchool = new DefaultSchool();
    school.id = 2;
    school.name = 'School 2';
    school.naturalId = 'school_2';
    school.districtId = 1;
    return school;
  }
});
