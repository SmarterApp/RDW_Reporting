import { TestModule } from "../../test/test.module";
import { CsvBuilder } from "./csv-builder.service";
import { inject, TestBed } from "@angular/core/testing";
import { Angular2CsvProvider } from "./angular-csv.provider";
import { Exam } from "../assessments/model/exam.model";
import { Student } from "../student/model/student.model";
import { SchoolYearPipe } from "../shared/format/school-year.pipe";
import { TranslateDatePipe } from "../shared/i18n/translate-date.pipe";
import { TranslateNumberPipe } from "../shared/i18n/translate-number.pipe";
import Spy = jasmine.Spy;
import { ApplicationSettingsService } from "../app-settings.service";
import { of } from "rxjs/observable/of";
import { Assessment } from '../assessments/model/assessment.model';

describe('CsvBuilder', () => {
  let datePipe: MockDatePipe;
  let schoolYearPipe: MockSchoolYearPipe;
  let angular2Csv: any;

  beforeEach(() => {
    datePipe = new MockDatePipe();
    angular2Csv = {
      export: jasmine.createSpy("export")
    };

    const settings: any = {};
    const mockApplicationSettingsService = jasmine.createSpyObj('ApplicationSettingsService', [ 'getSettings' ]);
    mockApplicationSettingsService.getSettings.and.callFake(() => of(settings));

    TestBed.configureTestingModule({
      imports: [
        TestModule
      ],
      providers: [
        CsvBuilder,
        { provide: TranslateDatePipe, useValue: datePipe },
        { provide: Angular2CsvProvider, useValue: angular2Csv },
        { provide: TranslateNumberPipe, useValue: MockDecimalPipe },
        { provide: SchoolYearPipe, useValue: schoolYearPipe },
        { provide: ApplicationSettingsService, useValue: mockApplicationSettingsService }
      ]
    });
  });

  it('should create',
    inject([ CsvBuilder ], (builder: CsvBuilder) => {

    expect(builder).toBeTruthy();
  }));

  it('should create tabular data from source data',
    inject([ CsvBuilder ], (builder: CsvBuilder) => {

      let sourceData: any[] = [{
        valueA: "value A1",
        valueB: "value B1"
      }, {
        valueA: "value A2",
        valueB: "value B2"
      }];

      builder
        .newBuilder()
        .withColumn('Column A', (item) => item.valueA)
        .withColumn('Column B', (item) => item.valueB)
        .build(sourceData);

      let tabularData: string[][] = angular2Csv.export.calls.mostRecent().args[0];

      expect(tabularData.length).toBe(3);
      expect(tabularData[0]).toEqual(["Column A", "Column B"]);
      expect(tabularData[1]).toEqual(["value A1", "value B1"]);
      expect(tabularData[2]).toEqual(["value A2", "value B2"]);
    }));

  it('should create tabular data from source data handling empty scale scores',
    inject([ CsvBuilder ], (builder: CsvBuilder) => {
      let exams = [ {score: 2580, level: 1 }, {score: null, level: null}].map(x => {
        let exam = new Exam();
        exam.score = x.score;
        exam.level = x.level;

        return exam;
      });

      const assessment = <Assessment>{ subject: 'Math', type: 'ica' };

      builder
        .newBuilder()
        .withScaleScore((exam) => exam)
        .withAchievementLevel(() => assessment,(exam) => exam)
        .withReportingCategory(() => assessment, (exam) => exam)
        .build(exams);

      let tabularData: string[][] = angular2Csv.export.calls.mostRecent().args[0];

      expect(tabularData.length).toBe(3);
      expect(tabularData[0]).toEqual(["csv-builder.scale-score", "csv-builder.achievement-level", "common.results.assessment-exam-columns.iab.performance"]);
      expect(tabularData[1]).toEqual(<any>[2580, "subject.Math.asmt-type.ica.level.1.name", "subject.Math.asmt-type.ica.level.1.name"]);
      expect(tabularData[2]).toEqual(["", "", ""]);
    }));

  it('should join accommodation codes by a pipe',
    inject([ CsvBuilder ], (builder: CsvBuilder) => {
      let exams = [ { codes: [ "ABC", "ACE", "ACDC"]}, { codes: [ "123" ] }].map(x => {
        let exam = new Exam();
        exam.accommodationCodes = x.codes;
        return exam;
      });

      builder
        .newBuilder()
        .withAccommodationCodes(exam => exam)
        .build(exams);

      let tabularData: string[][] = angular2Csv.export.calls.mostRecent().args[0];

      expect(tabularData.length).toBe(3);
      expect(tabularData[0]).toEqual(["csv-builder.accommodation-codes"]);
      expect(tabularData[1]).toEqual(["ABC|ACE|ACDC"]);
      expect(tabularData[2]).toEqual(["123"]);
    }));

  it('should add a column for each ethnicity',
    inject([ CsvBuilder ], (builder: CsvBuilder) => {
      let exams = [ { codes: [ "ethnicity1", "ethnicity2", "ethnicity3" ]}, { codes: [ "ethnicity7" ] }].map(x => {
        let exam = new Exam();
        exam.student = new Student();
        exam.student.ethnicityCodes = x.codes;
        return exam;
      });

      let ethnicityOptions = [ "ethnicity1", "ethnicity2", "ethnicity3", "ethnicity4", "ethnicity5", "ethnicity6", "ethnicity7" ];

      builder
        .newBuilder()
        .withEthnicity(exam => exam, ethnicityOptions)
        .build(exams);

      let tabularData: string[][] = angular2Csv.export.calls.mostRecent().args[0];

      expect(tabularData.length).toBe(3);
      expect(tabularData[0]).toEqual(ethnicityOptions);
      expect(tabularData[1]).toEqual(["common.polar.1", "common.polar.1", "common.polar.1", "", "", "", ""]);
      expect(tabularData[2]).toEqual(["", "", "", "", "", "", "common.polar.1"]);
    }));
});

export class MockDatePipe {
  transform: Spy = jasmine.createSpy("transform");
}

export class MockSchoolYearPipe{
  transform: Spy = jasmine.createSpy("transform");
}

export class MockDecimalPipe {
  transform: Spy = jasmine.createSpy("transform");
}

export class MockTranslateService {
  instant: Spy = jasmine.createSpy("instant");
}
