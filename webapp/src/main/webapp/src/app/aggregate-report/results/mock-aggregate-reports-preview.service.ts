import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AggregateReportItem } from "../model/aggregate-report-item.model";
import { AssessmentDetailsService } from "./assessment-details.service";
import { AssessmentDetails } from "../model/assessment-details.model";
import { HttpClient } from "@angular/common/http";
import { AggregateReportFormSettings } from "../aggregate-report-form-settings";
import { CodedEntity } from "../aggregate-report-options";

/**
 * This service is used by the aggregate reports preview
 */
@Injectable()
export class MockAggregateReportsPreviewService {

  constructor(private http: HttpClient,
              private assessmentDetailsService: AssessmentDetailsService) {
  }

  public generateSampleData(options: string[], settings: AggregateReportFormSettings) {
    let detailsObservable: Observable<AssessmentDetails> = this.assessmentDetailsService.getDetails(settings.assessmentType.id);

    let mockData: Array<any> = this.mockResponse(options, settings);

    return Observable.forkJoin(detailsObservable, Observable.of(mockData))
      .map((value) => {
        let details: AssessmentDetails = value[ 0 ];
        let apiReportItems: any = value[ 1 ];

        if (apiReportItems === null) return [];
        return this.mapReportPreviewItemsFromApi(details, apiReportItems);
      });
  }

  private mockResponse(options: string[], settings: AggregateReportFormSettings): any[] {
    let array: any[] = [];
    let organizationNames = [ 'Organization A' ];

    for (let organizationName of organizationNames) {
      for (let year of settings.schoolYears) {
        for (let grade of settings.assessmentGrades) {
          array.push(this.createApiItem2(organizationName, "Overall", grade, { id: 1, code: null }, year, null));
        }
      }
    }

    array = this.generateRowsForOption2(options, 'Overall', array, null, organizationNames, settings.schoolYears, settings.assessmentGrades);
    array = this.generateRowsForOption2(options, 'Gender', array, settings.genders, organizationNames, settings.schoolYears, settings.assessmentGrades);
    array = this.generateRowsForOption2(options, 'Ethnicity', array, settings.ethnicities, organizationNames, settings.schoolYears, settings.assessmentGrades);
    array = this.generateRowsForOption2(options, 'LEP', array, settings.limitedEnglishProficiencies, organizationNames, settings.schoolYears, settings.assessmentGrades);
    array = this.generateRowsForOption2(options, 'MigrantStatus', array, settings.migrantStatuses, organizationNames, settings.schoolYears, settings.assessmentGrades);
    array = this.generateRowsForOption2(options, 'EconomicDisadvantage', array, settings.economicDisadvantages, organizationNames, settings.schoolYears, settings.assessmentGrades);
    array = this.generateRowsForOption2(options, 'IEP', array, settings.ieps, organizationNames, settings.schoolYears, settings.assessmentGrades);
    array = this.generateRowsForOption2(options, 'Section504', array, settings.plan504s, organizationNames, settings.schoolYears, settings.assessmentGrades);

    return array;
  }

  private generateRowsForOption2(options: string[], key: string, array: any[], datas: any[], organizationNames: string[], years: number[], grades: CodedEntity[]): any[] {
    if (options && options.indexOf(key) >= 0) {
      for (let organizationName of organizationNames) {
        for (let year of years) {
          for (let data of datas) {
            for (let grade of grades) {
              array.push(this.createApiItem2(organizationName, key, grade, {
                id: 1,
                code: null
              }, year, (<CodedEntity>data).code !== undefined ? data.code : data));
            }
          }
        }
      }
    }
    return array;
  }

  private mapReportPreviewItemsFromApi(details: AssessmentDetails, apiModels: any[]): AggregateReportItem[] {
    return apiModels.map((apiModel, idx) => this.mapReportPreviewItemFromApi(details, apiModel, idx));
  }

  private mapReportPreviewItemFromApi(details: AssessmentDetails, apiModel: any, idx: number): AggregateReportItem {
    let uiModel = new AggregateReportItem();
    uiModel.assessmentId = apiModel.assessment.id;
    uiModel.gradeId = apiModel.assessment.gradeId;
    uiModel.schoolYear = apiModel.examSchoolYear;
    uiModel.organizationType = apiModel.organization.type;
    uiModel.organizationName = apiModel.organization.name;
    uiModel.dimensionType = apiModel.dimension.type;
    uiModel.dimensionValue = apiModel.dimension.code || 'default';
    uiModel.itemId = idx;
    uiModel.avgScaleScore = '----';
    uiModel.avgStdErr = 0;

    for (let level = 1; level <= details.performanceLevels; level++) {
      uiModel.performanceLevelCounts.push('--');
    }

    for (let level = 0; level < uiModel.performanceLevelCounts.length; level++) {
      uiModel.performanceLevelPercents.push(Math.floor(100 / uiModel.performanceLevelCounts.length));
    }

    return uiModel;
  }

  private createApiItem2 = function (orgName: string, type: string, grade: CodedEntity, subject: CodedEntity, schoolYear: number, code: string): any {
    return {
      "dimension": { "type": type, "code": code || 'default' },
      "organization": { "type": "School", "name": orgName, "id": 1 },
      "assessment": { "id": 231, "gradeId": grade.code, "subjectId": subject.id },
      "examSchoolYear": schoolYear,
      "measures": {
        "avgScaleScore": "----",
        "avgStdErr": 99,
        "level1Count": 25,
        "level2Count": 25,
        "level3Count": 25,
        "level4Count": 25
      }
    }
  }

}
