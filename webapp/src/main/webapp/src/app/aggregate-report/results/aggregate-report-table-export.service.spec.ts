import { AggregateReportTableExportService, ExportOptions } from './aggregate-report-table-export.service';
import { CsvBuilder } from '../../csv-export/csv-builder.service';
import { TranslateService } from '@ngx-translate/core';
import { inject, TestBed } from '@angular/core/testing';
import { AggregateReportItem } from './aggregate-report-item';
import { DefaultSchool } from '../../shared/organization/organization';
import { ValueDisplayTypes } from '../../shared/display-options/value-display-type';
import { PerformanceLevelDisplayTypes } from '../../shared/display-options/performance-level-display-type';
import { Subgroup } from '../subgroup/subgroup';
import { AggregateReportType } from "../aggregate-report-form-settings";
import Spy = jasmine.Spy;
import CallInfo = jasmine.CallInfo;

describe('AggregateReportTableExportService', () => {
  let itemIdx = 1;
  let service: AggregateReportTableExportService;
  let csvBuilder: CsvBuilder;
  let translateService: TranslateService;
  let options: ExportOptions;

  beforeEach(() => {
    options = {
      valueDisplayType: ValueDisplayTypes.Percent,
      performanceLevelDisplayType: PerformanceLevelDisplayTypes.Separate,
      columnOrdering: [ 'organization', 'assessmentGrade', 'schoolYear', 'dimension' ],
      assessmentDefinition: {
        typeCode: 'ica',
        interim: true,
        performanceLevels: [ 1, 2, 3, 4 ],
        performanceLevelCount: 4,
        performanceLevelDisplayTypes: [],
        performanceLevelGroupingCutPoint: 3,
        aggregateReportIdentityColumns: [ 'columnA' ],
        aggregateReportStateResultsEnabled: false,
        aggregateReportTypes: [ null ]
      },
      name: 'my_export',
      reportType: AggregateReportType.GeneralPopulation
    };

    csvBuilder = jasmine.createSpyObj(
      'CsvBuilder',
      [ 'newBuilder', 'withFilename', 'withColumn', 'build' ]
    );
    (csvBuilder.withFilename as Spy).and.callFake(() => csvBuilder);
    (csvBuilder.newBuilder as Spy).and.callFake(() => csvBuilder);
    (csvBuilder.withColumn as Spy).and.callFake(() => csvBuilder);

    translateService = jasmine.createSpyObj(
      'TranslateService',
      [ 'instant' ]
    );
    (translateService.instant as Spy).and.callFake((key) => key);

    TestBed.configureTestingModule({
      providers: [
        AggregateReportTableExportService,
        { provide: CsvBuilder, useValue: csvBuilder },
        { provide: TranslateService, useValue: translateService }
      ]
    });
  });

  beforeEach(inject([ AggregateReportTableExportService ], (injectedSvc: AggregateReportTableExportService) => {
    service = injectedSvc;
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should set the export filename', () => {
    const item: AggregateReportItem = mockItem();
    service.exportTable([ item ], options);

    expect(csvBuilder.withFilename).toHaveBeenCalledWith(options.name);
  });

  it('should append user-ordered columns in the specified order', () => {
    (options as any).columnOrdering = [ 'dimension', 'organization', 'assessmentGrade', 'schoolYear' ];

    const item: AggregateReportItem = mockItem();
    service.exportTable([ item ], options);

    const withColumnCalls: CallInfo[] = (csvBuilder.withColumn as Spy).calls.all();

    // dimension
    expect(withColumnCalls[ 0 ].args).toEqual([
      'aggregate-report-table.columns.dimension',
      jasmine.any(Function)
    ]);

    // organization
    expect(withColumnCalls[ 1 ].args).toEqual([
      'aggregate-report-table.columns.organization',
      jasmine.any(Function)
    ]);
    expect(withColumnCalls[ 2 ].args).toEqual([
      'aggregate-report-table.columns.organization-id',
      jasmine.any(Function)
    ]);

    // assessmentGrade
    expect(withColumnCalls[ 3 ].args).toEqual([
      'aggregate-report-table.columns.assessment-grade',
      jasmine.any(Function)
    ]);

    // schoolYear
    expect(withColumnCalls[ 4 ].args).toEqual([
      'aggregate-report-table.columns.school-year',
      jasmine.any(Function)
    ]);
  });

  it('should set export headers for separate performance levels', () => {
    const item: AggregateReportItem = mockItem();
    service.exportTable([ item ], options);

    const withColumnCalls: CallInfo[] = (csvBuilder.withColumn as Spy).calls.all();
    const headerKeys: string[] = withColumnCalls.map(call => call.args[ 0 ]);
    expect(headerKeys).toEqual([
      'aggregate-report-table.columns.organization',
      'aggregate-report-table.columns.organization-id',
      'aggregate-report-table.columns.assessment-grade',
      'aggregate-report-table.columns.school-year',
      'aggregate-report-table.columns.dimension',
      'aggregate-report-table.columns.students-tested',
      'aggregate-report-table.columns.avg-scale-score',
      'common.assessment-type.ica.performance-level.1.name-prefix aggregate-report-table.columns.performance-level-suffix',
      'common.assessment-type.ica.performance-level.2.name-prefix aggregate-report-table.columns.performance-level-suffix',
      'common.assessment-type.ica.performance-level.3.name-prefix aggregate-report-table.columns.performance-level-suffix',
      'common.assessment-type.ica.performance-level.4.name-prefix aggregate-report-table.columns.performance-level-suffix'
    ]);
  });

  it('should set export headers for separate grouped levels', () => {
    (options as any).performanceLevelDisplayType = PerformanceLevelDisplayTypes.Grouped;
    const item: AggregateReportItem = mockItem();
    service.exportTable([ item ], options);

    const withColumnCalls: CallInfo[] = (csvBuilder.withColumn as Spy).calls.all();
    const headerKeys: string[] = withColumnCalls.map(call => call.args[ 0 ]);
    expect(headerKeys).toEqual([
      'aggregate-report-table.columns.organization',
      'aggregate-report-table.columns.organization-id',
      'aggregate-report-table.columns.assessment-grade',
      'aggregate-report-table.columns.school-year',
      'aggregate-report-table.columns.dimension',
      'aggregate-report-table.columns.students-tested',
      'aggregate-report-table.columns.avg-scale-score',
      'aggregate-report-table.columns.grouped-performance-level-prefix.0 aggregate-report-table.columns.performance-level-suffix',
      'aggregate-report-table.columns.grouped-performance-level-prefix.1 aggregate-report-table.columns.performance-level-suffix'
    ]);

  });

  function mockItem(): AggregateReportItem {
    const item: AggregateReportItem = new AggregateReportItem();
    item.itemId = itemIdx++;
    item.assessmentId = 123;
    item.assessmentGradeCode = '03';
    item.subjectCode = 'ELA';
    item.schoolYear = 1999;
    item.avgScaleScore = 2500;
    item.avgStdErr = 50;
    item.studentsTested = 100;
    item.performanceLevelByDisplayTypes = {
      Separate: {
        Number: [ 10, 20, 30, 40 ],
        Percent: [ 11, 21, 31, 41 ]
      },
      Grouped: {
        Number: [ 30, 70 ],
        Percent: [ 31, 71 ]
      }
    };

    const org: DefaultSchool = new DefaultSchool();
    org.id = 123;
    org.name = 'School A';
    org.naturalId = 'school_a';
    item.organization = org;

    item.subgroup = <Subgroup>{
      id: 'Gender:Male',
      name: 'Gender: Male',
      dimensionGroups: [
        {
          type: 'Gender',
          values: [
            {
              code: 'Male',
              translationCode: ''
            }
          ]
        }
      ]
    };

    return item;
  }

});
