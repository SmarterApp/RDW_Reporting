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

  public generateQueryBuilderSampleData(query: AggregateReportQuery, queryModel: QueryBuilderModel) {
    let generatedResponse: any;
    // if (!query.organizations || !query.organizations.length) return [];
    // if (query.organizations.length == 1) {
    let detailsObservable: Observable<AssessmentDetails> = this.assessmentDetailsService.getDetails(query.assessmentType);

    let mockData: Array<any> = this.createResponse(query, queryModel);

    return Observable.forkJoin(detailsObservable, Observable.of(mockData))
      .map((value) => {
        let details: AssessmentDetails = value[ 0 ];
        let apiReportItems: any = value[ 1 ];

        if (apiReportItems === null) return [];
        return this.mapReportItemsFromApi(details, apiReportItems);
      });
  }

  private createResponse(query: AggregateReportQuery, queryModel: QueryBuilderModel) {
    let array: any[] = [];
    let gender = query.gender;
    let genders: string[] = gender == -1 ? [ 'Female', 'Male' ] : [ gender ];
    let years = query.getSchoolYearsSelected();
    let grades = query.getSelected(query.assessmentGrades);
    let ethnicities = query.getSelected(query.ethnicities);
    let organizationNames = [ 'testA' ];

    if (ethnicities.length == 1 && ethnicities[ 0 ] == "0") {
      ethnicities.pop();
      queryModel.ethnicities.forEach(ethnicity => {
        ethnicities.push(ethnicity);
      })
    }

    if (grades.length == 1 && grades[ 0 ] == "0") {
      grades.pop();
      queryModel.grades.forEach(grade => {
        grades.push(grade);
      })

    }

    if (years.length == 1 && years[0] == 0) {
      years.pop();
      queryModel.schoolYears.forEach(year => {
        years.push(year);
      })
    }

    for (let organizationName of organizationNames) {
      for (let year of years) {
        for (let grade of grades) {
          array.push(this.createApiItem(organizationName, "Overall", grade, 1, year, null));
        }
      }
    }


    for (let organizationName of organizationNames) {
      for (let year of years) {
        for (let ethnicity of ethnicities) {
          for (let grade of grades) {
            array.push(this.createApiItem(organizationName, "Ethnicity", grade, 1, year, ethnicity));
          }
        }
      }
    }

    for (let organizationName of organizationNames) {
      for (let year of years) {
        for (let gender of genders) {
          for (let grade of grades) {
            array.push(this.createApiItem(organizationName, "Gender", grade, 1, year, gender));
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
        "avgScaleScore": 2526,
        "avgStdErr": 77,
        "level1Count": 1,
        "level2Count": 2,
        "level3Count": 3,
        "level4Count": 4
      }
    }
  }
}
