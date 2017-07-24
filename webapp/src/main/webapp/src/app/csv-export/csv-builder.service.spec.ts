import { TestModule } from "../../test/test.module";
import { CsvBuilder } from "./csv-builder.service";
import { inject, TestBed } from "@angular/core/testing";
import { DatePipe } from "@angular/common";
import { Angular2CsvProvider } from "./angular-csv.provider";
import Spy = jasmine.Spy;

fdescribe('CsvBuilder', () => {
  let datePipe: MockDatePipe;
  let angular2Csv: any;

  beforeEach(() => {
    datePipe = new MockDatePipe();
    angular2Csv = {
      export: jasmine.createSpy("export")
    };

    TestBed.configureTestingModule({
      imports: [
        TestModule
      ],
      providers: [
        CsvBuilder, {
          provide: DatePipe,
          useValue: datePipe
        }, {
          provide: Angular2CsvProvider,
          useValue: angular2Csv
        }
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
});

export class MockDatePipe {
  transform: Spy = jasmine.createSpy("transform");
}
