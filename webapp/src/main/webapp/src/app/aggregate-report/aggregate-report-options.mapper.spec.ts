import { AggregateReportOptions } from './aggregate-report-options';
import { AggregateReportOptionsMapper } from './aggregate-report-options.mapper';
import { ValueDisplayTypes } from '../shared/display-options/value-display-type';
import { of } from 'rxjs/observable/of';
import { AggregateReportFormSettings } from './aggregate-report-form-settings';
import { Observable } from 'rxjs/Observable';
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
      'getDefinitionsByDefinitionKey'
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
    (assessmentDefinitionService.getDefinitionsByDefinitionKey as Spy).and.callFake(() => of(
      new Map([ [ '1', {
        typeCode: '1',
        interim: true,
        performanceLevels: [],
        performanceLevelCount: 0,
        performanceLevelDisplayTypes: [ 'displayTypeA' ],
        performanceLevelGroupingCutPoint: 0,
        aggregateReportIdentityColumns: [ 'columnA' ],
        aggregateReportStateResultsEnabled: true,
        aggregateReportTypes: ['LongitudinalCohort', 'Claim']
      } ] ])
    ));

    const options: AggregateReportOptions = {
      assessmentGrades: [ '1', '2' ],
      assessmentTypes: [ '1', '2' ],
      completenesses: [ '1', '2' ],
      dimensionTypes: [ '1', '2' ],
      interimAdministrationConditions: [ '1', '2' ],
      queryTypes: [ 'queryTypeA', 'queryTypeB' ],
      schoolYears: [ 1, 2 ],
      statewideReporter: false,
      subjects: [ '1', '2' ],
      summativeAdministrationConditions: [ '1', '2' ],
      studentFilters: {
        economicDisadvantages: [ '1', '2' ],
        ethnicities: [ '1', '2' ],
        englishLanguageAcquisitionStatuses: [ '1', '2' ],
        genders: [ '1', '2' ],
        individualEducationPlans: [ '1', '2' ],
        limitedEnglishProficiencies: [ '1', '2' ],
        migrantStatuses: [ '1', '2' ],
        section504s: [ '1', '2' ]
      },
      reportTypes: [ '1', '2' ],
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
          section504s: options.studentFilters.section504s
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
        }
      });
    });

  });

  class MockApplicationSettingsService {
    getSettings(): Observable<any> {
      return of([]);
    }

  }
});

