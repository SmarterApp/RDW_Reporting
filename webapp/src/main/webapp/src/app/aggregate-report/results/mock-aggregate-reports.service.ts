import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AggregateReportItem } from "../model/aggregate-report-item.model";
import { ResponseUtils } from "../../shared/response-utils";
import { AssessmentDetailsService } from "./assessment-details.service";
import { AggregateReportQuery } from "../model/aggregate-report-query.model";
import { AssessmentDetails } from "../model/assessment-details.model";
import { HttpClient } from "@angular/common/http";
import { QueryBuilderModel } from "../model/query-builder.model";

/**
 * This placeholder service will eventually submit an AggregateReportQuery
 * to the backend and return the list of supplied AggregateReportItem results.
 *
 * As a mock service, this just returns the sample payload at /assets/public/test-aggregate.json
 */
@Injectable()
export class MockAggregateReportsService {

  constructor(private http: HttpClient,
              private assessmentDetailsService: AssessmentDetailsService) {
  }

  public getReportData(query: AggregateReportQuery): Observable<AggregateReportItem[]> {
    let detailsObservable: Observable<AssessmentDetails> = this.assessmentDetailsService.getDetails(query.assessmentType);
    let dataObservable: Observable<Object> = this.http.get(`/assets/public/test-aggregate.json`)
      .catch(ResponseUtils.badResponseToNull);
    return Observable.forkJoin(detailsObservable, dataObservable)
      .map((value) => {
        let details: AssessmentDetails = value[ 0 ];
        let apiReportItems: any = value[ 1 ];

        if (apiReportItems === null) return [];
        return this.mapReportItemsFromApi(details, apiReportItems);
      });
  }

  public generateQueryBuilderSampleData(options: string[], query: AggregateReportQuery, queryModel: QueryBuilderModel) {
    let generatedResponse: any;
    let detailsObservable: Observable<AssessmentDetails> = this.assessmentDetailsService.getDetails(query.assessmentType);

    let mockData: Array<any> = this.createResponse(options, query, queryModel);

    return Observable.forkJoin(detailsObservable, Observable.of(mockData))
      .map((value) => {
        let details: AssessmentDetails = value[ 0 ];
        let apiReportItems: any = value[ 1 ];

        if (apiReportItems === null) return [];
        return this.mapReportItemsFromApi(details, apiReportItems);
      });
  }

  private createResponse(options: string[], query: AggregateReportQuery, queryModel: QueryBuilderModel): any[] {
    let array: any[] = [];
    let years = query.getSchoolYearsSelected();
    let grades = query.getSelected(query.assessmentGrades);
    let ethnicities = query.getSelected(query.ethnicities);
    let organizationNames = [ 'Organization A' ];

    if (ethnicities.length == 1 && ethnicities[ 0 ] == "0") {
      ethnicities.pop();
      queryModel.ethnicities.forEach(ethnicity => {
        ethnicities.push(ethnicity);
      });
    }

    if (grades.length == 1 && grades[ 0 ] == "0") {
      grades.pop();
      queryModel.grades.forEach(grade => {
        grades.push(grade);
      });
    }

    if (years.length == 1 && years[ 0 ] == 0) {
      years.pop();
      queryModel.schoolYears.forEach(year => {
        years.push(year);
      });
    }

    for (let organizationName of organizationNames) {
      for (let year of years) {
        for (let grade of grades) {
          array.push(this.createApiItem(organizationName, "Overall", grade, 1, year, null));
        }
      }
    }

    array = this.generateRowsForOption(options, 'Ethnicity', array, ethnicities, organizationNames, years, grades);
    array = this.generateRowsForOption(options, 'Gender', array, query.gender == -1 ? [ 'Female', 'Male' ] : [ query.gender ], organizationNames, years, grades);
    array = this.generateRowsForOption(options, 'LimitedEnglishProficiency', array, query.limitedEnglishProficiency == -1 ? [ '2', '1' ] : [ query.limitedEnglishProficiency.toLocaleString() ], organizationNames, years, grades);
    array = this.generateRowsForOption(options, 'MigrantStatus', array, query.migrantStatus == -1 ? [ '2', '1' ] : [ query.migrantStatus.toLocaleString() ], organizationNames, years, grades);
    array = this.generateRowsForOption(options, 'EconomicDisadvantage', array, query.economicDisadvantage == -1 ? [ '2', '1' ] : [ query.economicDisadvantage.toLocaleString() ], organizationNames, years, grades);
    array = this.generateRowsForOption(options, 'IEP', array, query.iep == -1 ? [ '2', '1' ] : [ query.iep.toLocaleString() ], organizationNames, years, grades);
    array = this.generateRowsForOption(options, '504Plan', array, query.plan504 == -1 ? [ '2', '1' ] : [ query.plan504.toLocaleString() ], organizationNames, years, grades);

    return array;
  }


  private generateRowsForOption(options: string[], key: string, array: any[], datas: any[], organizationNames: string[], years: number[], grades: any[]): any[] {
    if (options && options.indexOf(key) >= 0) {
      for (let organizationName of organizationNames) {
        for (let year of years) {
          for (let data of datas) {
            for (let grade of grades) {
              array.push(this.createApiItem(organizationName, key, grade, 1, year, data));
            }
          }
        }
      }
    }
    return array;
  }

  private mapReportItemsFromApi(details: AssessmentDetails, apiModels: any[]): AggregateReportItem[] {
    return apiModels.map((apiModel, idx) => this.mapReportItemFromApi(details, apiModel, idx));
  }

  private mapReportItemFromApi(details: AssessmentDetails, apiModel: any, idx: number): AggregateReportItem {
    let uiModel = new AggregateReportItem();
    uiModel.assessmentId = apiModel.assessment.id;
    uiModel.gradeId = apiModel.assessment.gradeId;
    uiModel.subjectId = apiModel.assessment.subjectId;
    uiModel.schoolYear = apiModel.examSchoolYear;
    uiModel.organizationType = apiModel.organization.type;
    //TODO: "California" should come from the back-end api populated via config-properties
    uiModel.organizationName = (uiModel.organizationType == "State")
      ? "California"
      : apiModel.organization.name;
    uiModel.organizationId = apiModel.organization.id;
    uiModel.dimensionType = apiModel.dimension.type;
    uiModel.dimensionValue = apiModel.dimension.code || 'default';
    uiModel.itemId = idx;

    let apiMeasures = apiModel.measures || {};
    uiModel.avgScaleScore = apiMeasures.avgScaleScore || 0;
    uiModel.avgStdErr = apiMeasures.avgStdErr || 0;

    let totalTested: number = 0;
    for (let level = 1; level <= details.performanceLevels; level++) {
      let count = apiMeasures[ `level${level}Count` ] || 0;
      totalTested += count;
      uiModel.performanceLevelCounts.push(count);
    }
    uiModel.studentsTested = totalTested;

    for (let level = 0; level < uiModel.performanceLevelCounts.length; level++) {
      let percent = totalTested == 0 ? 0 : Math.floor((uiModel.performanceLevelCounts[ level ] / totalTested) * 100);
      uiModel.performanceLevelPercents.push(percent);
    }

    //If there is a rollup level, calculate the grouped values
    if (details.performanceGroupingCutpoint > 0) {
      let belowCount: number = 0;
      let aboveCount: number = 0;
      for (let level = 0; level < uiModel.performanceLevelCounts.length; level++) {
        if (level < details.performanceGroupingCutpoint - 1) {
          belowCount += uiModel.performanceLevelCounts[ level ];
        } else {
          aboveCount += uiModel.performanceLevelCounts[ level ];
        }
      }
      uiModel.groupedPerformanceLevelCounts.push(belowCount);
      uiModel.groupedPerformanceLevelPercents.push(totalTested == 0 ? 0 : Math.floor((belowCount / totalTested) * 100));
      uiModel.groupedPerformanceLevelCounts.push(aboveCount);
      uiModel.groupedPerformanceLevelPercents.push(totalTested == 0 ? 0 : Math.floor((aboveCount / totalTested) * 100));
    }

    return uiModel;
  }

  private createApiItem = function (orgName: string, type: string, gradeId: string, subjectId: number, schoolYear: number, code: string): any {
    return {
      "dimension": { "type": type, "code": code || 'default' },
      "organization": { "type": "School", "name": orgName, "id": 1 },
      "assessment": { "id": 231, "gradeId": gradeId, "subjectId": subjectId },
      "examSchoolYear": schoolYear,
      "measures": {
        "avgScaleScore": Math.floor(2000 + Math.random() * 1000),
        "avgStdErr": Math.floor(Math.random() * 125),
        "level1Count": Math.floor(Math.random() * 100),
        "level2Count": Math.floor(Math.random() * 100),
        "level3Count": Math.floor(Math.random() * 100),
        "level4Count": Math.floor(Math.random() * 100)
      }
    }
  }
}
