import { AggregateReportOptions } from './aggregate-report-options';
import { AggregateReportOptionsMapper } from './aggregate-report-options.mapper';
import { ValueDisplayTypes } from '../shared/display-options/value-display-type';
import { of ,  Observable } from 'rxjs';
import { AggregateReportFormSettings, AggregateReportType } from './aggregate-report-form-settings';
import { AssessmentDefinition } from './assessment/assessment-definition';
import Spy = jasmine.Spy;

describe('AggregateReportOptionsMapper', () => {

  let fixture: AggregateReportOptionsMapper;
  let translateService;
  let schoolYearPipe;
  let displayOptionService;
  let assessmentDefinitionService;
  let applicationSettingService;

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
    assessmentDefinitionService = jasmine.createSpyObj('AssessmentDefinitionService', [
      'get'
    ]);
    applicationSettingService = new MockApplicationSettingsService();
    fixture = new AggregateReportOptionsMapper(
      translateService,
      schoolYearPipe,
      displayOptionService,
      assessmentDefinitionService,
      applicationSettingService
    );
  });

  it('toDefaultSettings should create default settings correctly from options', () => {

    const reportName = 'Report Name';
    (translateService.instant as Spy).and.callFake(() => reportName);
    (assessmentDefinitionService.get as Spy).and.callFake(() => <AssessmentDefinition>{
        typeCode: 'iab',
        interim: true,
        performanceLevels: [],
        performanceLevelCount: 0,
        performanceLevelDisplayTypes: [ 'displayTypeA' ],
        performanceLevelGroupingCutPoint: 0,
        aggregateReportIdentityColumns: [ 'columnA' ],
        aggregateReportStateResultsEnabled: true,
        aggregateReportTypes: [ AggregateReportType.LongitudinalCohort, AggregateReportType.Claim ]
      }
    );

    const options: AggregateReportOptions = {
      assessmentGrades: [ '1', '2' ],
      assessmentTypes: [ '1', '2' ],
      completenesses: [ '1', '2' ],
      dimensionTypes: [ '1', '2' ],
      interimAdministrationConditions: [ '1', '2' ],
      queryTypes: [ 'queryTypeA', 'queryTypeB' ],
      schoolYears: [ 1, 2 ],
      statewideReporter: false,
      subjects: [
        {
          code: '1',
          assessmentType: '1',
          targetReport: true
        }, {
          code: '2',
          assessmentType: '2',
          targetReport: true
        }
      ],
      summativeAdministrationConditions: [ '1', '2' ],
      studentFilters: {
        economicDisadvantages: [ '1', '2' ],
        ethnicities: [ '1', '2' ],
        englishLanguageAcquisitionStatuses: [ '1', '2' ],
        genders: [ '1', '2' ],
        individualEducationPlans: [ '1', '2' ],
        limitedEnglishProficiencies: [ '1', '2' ],
        migrantStatuses: [ '1', '2' ],
        section504s: [ '1', '2' ],
        languages: ['1', '2'],
        militaryConnectedCodes: ['1', '2']
      },
      reportTypes: [ AggregateReportType.GeneralPopulation, AggregateReportType.LongitudinalCohort ],
      claims: []
    };
    fixture.toDefaultSettings(options).subscribe(settings => {
      expect(settings).toEqual(<AggregateReportFormSettings>{
        performanceLevelDisplayType: 'displayTypeA',
        interimAdministrationConditions: [ options.interimAdministrationConditions[ 0 ] ],
        summativeAdministrationConditions: [ options.summativeAdministrationConditions[ 0 ] ],
        assessmentType: options.assessmentTypes[ 0 ],
        completenesses: [ options.completenesses[ 0 ] ],
        dimensionTypes: [],
        districts: [],
        includeAllDistricts: false,
        includeAllDistrictsOfSelectedSchools: true,
        includeAllSchoolsOfSelectedDistricts: false,
        includeStateResults: true,
        queryType: options.queryTypes[ 0 ],
        reportType: options.reportTypes[ 0 ],
        schools: [],
        subjects: options.subjects,
        subgroups: [],
        valueDisplayType: ValueDisplayTypes.Percent,
        columnOrder: [ 'columnA' ],
        studentFilters: {
          economicDisadvantages: options.studentFilters.economicDisadvantages,
          ethnicities: options.studentFilters.ethnicities,
          englishLanguageAcquisitionStatuses: options.studentFilters.englishLanguageAcquisitionStatuses,
          genders: options.studentFilters.genders,
          individualEducationPlans: options.studentFilters.individualEducationPlans,
          limitedEnglishProficiencies: options.studentFilters.limitedEnglishProficiencies,
          migrantStatuses: options.studentFilters.migrantStatuses,
          section504s: options.studentFilters.section504s,
          languages: options.studentFilters.languages,
          militaryConnectedCodes: options.studentFilters.militaryConnectedCodes
        },
        generalPopulation: {
          assessmentGrades: [],
          schoolYears: [ options.schoolYears[ 0 ] ]
        },
        claimReport: {
          assessmentGrades: [],
          schoolYears: [ options.schoolYears[ 0 ] ],
          claimCodesBySubject: []
        },
        longitudinalCohort: {
          assessmentGrades: [],
          toSchoolYear: options.schoolYears[ 0 ]
        },
        targetReport: {
          assessmentGrade: options.assessmentGrades[ 0 ],
          schoolYear: options.schoolYears[ 0 ],
          subjectCode: options.subjects[ 0 ].code
        },
      });
    });

  });

  class MockApplicationSettingsService {
    getSettings(): Observable<any> {
      return of([]);
    }

  }
});

