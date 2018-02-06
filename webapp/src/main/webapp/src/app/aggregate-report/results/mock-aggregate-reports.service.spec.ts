import Spy = jasmine.Spy;
import { MockAggregateReportsService } from "./mock-aggregate-reports.service";
import { Observable } from "rxjs/Observable";
import { AggregateReportQuery } from "../model/aggregate-report-query.model";
import { AssessmentType } from "../../shared/enum/assessment-type.enum";
import { AggregateReportItem } from "./aggregate-report-item";
import { AssessmentDefinitionService } from "../assessment/assessment-definition.service";
import { OrganizationMapper } from "../../shared/organization/organization.mapper";

/**
 * @deprecated
 */
describe('MockAggregateReportsService', () => {

  let query: AggregateReportQuery;
  let mockAssessmentDefinitionService: MockAssessmentDefinitionService;
  let http: MockHttp;
  let service: MockAggregateReportsService;

  beforeEach(() => {
    query = new AggregateReportQuery();
    query.assessmentType = AssessmentType.ICA;

    mockAssessmentDefinitionService = new MockAssessmentDefinitionService();
    mockAssessmentDefinitionService.getDefinitionsByAssessmentTypeCode.and.returnValue(
      new AssessmentDefinitionService().getDefinitionsByAssessmentTypeCode()
    );

    http = new MockHttp();
    service = new MockAggregateReportsService(http as any, mockAssessmentDefinitionService as any, new OrganizationMapper());
  });

  it('should map api report items to model instances', (done) => {
    http.get.and.returnValue(Observable.of([
      createApiItem("org-a"),
      createApiItem("org-b"),
      createApiItem("org-c")
    ]));
      service.getReportData(query)
      .subscribe((items: AggregateReportItem[]) => {
        expect(items.length).toBe(3);

        done();
      });

    expect(http.get.calls.first().args[0]).toBe("/assets/public/test-aggregate.json");
  });

  it('should map api report items to model instances', (done) => {
    http.get.and.returnValue(Observable.of([
      createApiItem("org-a"),
      createApiItem("org-b"),
      createApiItem("org-c")
    ]));
    service.getReportData(query)
      .subscribe((items: AggregateReportItem[]) => {
        expect(items.length).toBe(3);

        done();
      });

    expect(http.get.calls.first().args[0]).toBe("/assets/public/test-aggregate.json");
  });

  it('should count total students tested', (done) => {
    http.get.and.returnValue(Observable.of([
      createApiItem("org-a")
    ]));

    service.getReportData(query)
      .subscribe((items: AggregateReportItem[]) => {
        let item: AggregateReportItem = items[0];
        expect(item.studentsTested).toBe(10);
        done();
      });
  });

  it('should calculate population percentages by performance level', (done) => {
    http.get.and.returnValue(Observable.of([
      createApiItem("org-a")
    ]));

    service.getReportData(query)
      .subscribe((items: AggregateReportItem[]) => {
        let item: AggregateReportItem = items[0];
        expect(item.performanceLevelPercents[0]).toBe(10);
        expect(item.performanceLevelPercents[1]).toBe(20);
        expect(item.performanceLevelPercents[2]).toBe(30);
        expect(item.performanceLevelPercents[3]).toBe(40);
        done();
      });
  });

  it('should calculate rollup counts and percentages', (done) => {
    http.get.and.returnValue(Observable.of([
      createApiItem("org-a")
    ]));

    service.getReportData(query)
      .subscribe((items: AggregateReportItem[]) => {
        let item: AggregateReportItem = items[0];
        expect(item.groupedPerformanceLevelCounts[0]).toBe(3);
        expect(item.groupedPerformanceLevelCounts[1]).toBe(7);
        expect(item.groupedPerformanceLevelPercents[0]).toBe(30);
        expect(item.groupedPerformanceLevelPercents[1]).toBe(70);
        done();
      });
  });

  it('should handle a zero count row', (done) => {
    let apiItem: any = createApiItem("org-a");
    delete apiItem.measures;
    http.get.and.returnValue(Observable.of([
      apiItem
    ]));

    service.getReportData(query)
      .subscribe((items: AggregateReportItem[]) => {
        let item: AggregateReportItem = items[0];
        expect(item.groupedPerformanceLevelCounts[0]).toBe(0);
        expect(item.groupedPerformanceLevelCounts[1]).toBe(0);
        expect(item.groupedPerformanceLevelPercents[0]).toBe(0);
        expect(item.groupedPerformanceLevelPercents[1]).toBe(0);
        expect(item.performanceLevelPercents[0]).toBe(0);
        expect(item.performanceLevelPercents[1]).toBe(0);
        expect(item.performanceLevelPercents[2]).toBe(0);
        expect(item.performanceLevelPercents[3]).toBe(0);
        expect(item.performanceLevelCounts[0]).toBe(0);
        expect(item.performanceLevelCounts[1]).toBe(0);
        expect(item.performanceLevelCounts[2]).toBe(0);
        expect(item.performanceLevelCounts[3]).toBe(0);

        done();
      });
  });

  let createApiItem = function(orgName: string): any {
    return {
      "dimension": { "type": "Overall" },
      "organization": { "organizationType": "School", "name": orgName, "id": 1 },
      "assessment": { "id": 231, "gradeId": 6, "subjectId": 1 },
      "examSchoolYear": 2018,
      "measures": {
        "avgScaleScore":2526,
        "avgStdErr":77,
        "level1Count": 1,
        "level2Count": 2,
        "level3Count": 3,
        "level4Count": 4
      }
    }
  }
});

class MockAssessmentDefinitionService {
  public getDefinitionsByAssessmentTypeCode: Spy = jasmine.createSpy("getDefinitionsByAssessmentTypeCode");
}

class MockHttp {
  public get: Spy = jasmine.createSpy("get");
}
