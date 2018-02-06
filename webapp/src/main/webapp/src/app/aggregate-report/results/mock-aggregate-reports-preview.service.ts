import { Injectable } from "@angular/core";
import { AggregateReportItem } from "./aggregate-report-item";
import { AggregateReportFormSettings } from "../aggregate-report-form-settings";
import { CodedEntity } from "../../shared/coded-entity";
import { AssessmentDefinition } from "../assessment/assessment-definition";
import { AssessmentDefinitionService } from "../assessment/assessment-definition.service";
import { OrganizationMapper } from "../../shared/organization/organization.mapper";

const avgScaleScore = 2500;
const stdErr = 50;
const studentsTested = 120;

/**
 * This service is used by the aggregate reports preview
 */
@Injectable()
export class MockAggregateReportsPreviewService {

  constructor(private assessmentDefinitionService: AssessmentDefinitionService,
              private organizationMapper: OrganizationMapper) {
  }

  public generateSampleData(options: string[], settings: AggregateReportFormSettings) {
    const mockData: Array<any> = this.mockResponse(options, settings);
    return this.assessmentDefinitionService
      .getDefinitionsByAssessmentTypeCode()
      .map(definitions => {
        const definition: AssessmentDefinition = definitions.get(settings.assessmentType.code);
        return this.mapReportPreviewItemsFromApi(definition, mockData);
      });
  }

  private mockResponse(options: string[], settings: AggregateReportFormSettings): any[] {
    let array: any[] = [];
    let organizationNames = [ 'Organization A' ]; // TODO replace this once organization selector has finished

    for (let organizationName of organizationNames) {
      for (let year of settings.schoolYears) {
        for (let grade of settings.assessmentGrades) {
          array.push(this.createApiItem(organizationName, "Overall", grade, { id: 1, code: null }, year, null));
        }
      }
    }


    array = this.generateRowsForOption(options, 'Overall', array, null, organizationNames, settings.schoolYears, settings.assessmentGrades);
    array = this.generateRowsForOption(options, 'Gender', array, settings.genders, organizationNames, settings.schoolYears, settings.assessmentGrades);
    array = this.generateRowsForOption(options, 'Ethnicity', array, settings.ethnicities, organizationNames, settings.schoolYears, settings.assessmentGrades);
    array = this.generateRowsForOption(options, 'LEP', array, settings.limitedEnglishProficiencies, organizationNames, settings.schoolYears, settings.assessmentGrades);
    array = this.generateRowsForOption(options, 'MigrantStatus', array, settings.migrantStatuses, organizationNames, settings.schoolYears, settings.assessmentGrades);
    array = this.generateRowsForOption(options, 'EconomicDisadvantage', array, settings.economicDisadvantages, organizationNames, settings.schoolYears, settings.assessmentGrades);
    array = this.generateRowsForOption(options, 'IEP', array, settings.individualEducationPlans, organizationNames, settings.schoolYears, settings.assessmentGrades);
    array = this.generateRowsForOption(options, 'Section504', array, settings.section504s, organizationNames, settings.schoolYears, settings.assessmentGrades);

    return array;
  }

  private generateRowsForOption(options: string[], key: string, array: any[], datas: any[], organizationNames: string[], years: number[], grades: CodedEntity[]): any[] {
    if (options && options.indexOf(key) >= 0) {
      for (let organizationName of organizationNames) {
        for (let year of years) {
          for (let data of datas) {
            for (let grade of grades) {
              array.push(this.createApiItem(organizationName, key, grade, {
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

  private mapReportPreviewItemsFromApi(definition: AssessmentDefinition, apiModels: any[]): AggregateReportItem[] {
    return apiModels.map((apiModel, idx) => this.mapReportPreviewItemFromApi(definition, apiModel, idx));
  }

  private mapReportPreviewItemFromApi(definition: AssessmentDefinition, apiModel: any, idx: number): AggregateReportItem {
    let uiModel = new AggregateReportItem();
    uiModel.assessmentId = apiModel.assessment.id;
    uiModel.gradeId = apiModel.assessment.gradeId;
    uiModel.schoolYear = apiModel.examSchoolYear;
    uiModel.organization = this.organizationMapper.map(apiModel.organization);
    uiModel.dimensionType = apiModel.dimension.type;
    uiModel.dimensionValue = apiModel.dimension.code || 'default';
    uiModel.itemId = idx;
    uiModel.avgScaleScore = avgScaleScore;
    uiModel.avgStdErr = stdErr;

    let apiMeasures = apiModel.measures || {};
    let totalTested: number = studentsTested;
    uiModel.studentsTested = totalTested;
    for (let level = 1; level <= definition.performanceLevelCount; level++) {
      uiModel.performanceLevelCounts.push(Math.floor(totalTested / definition.performanceLevelCount));
    }
    uiModel.studentsTested = totalTested;

    for (let level = 0; level < definition.performanceLevelCount; level++) {
      uiModel.performanceLevelPercents.push(Math.floor(100 / uiModel.performanceLevelCounts.length));
    }

    uiModel.groupedPerformanceLevelCounts.push(studentsTested / 2);
    uiModel.groupedPerformanceLevelCounts.push(studentsTested / 2);
    uiModel.groupedPerformanceLevelPercents.push(50);
    uiModel.groupedPerformanceLevelPercents.push(50);
    return uiModel;
  }

  private createApiItem = function (orgName: string, type: string, grade: CodedEntity, subject: CodedEntity, schoolYear: number, code: string): any {
    return {
      "dimension": { "type": type, "code": code || 'default' },
      "organization": { "type": "School", "name": orgName, "id": 1 },
      "assessment": { "id": 231, "gradeId": grade.code, "subjectId": subject.id },
      "examSchoolYear": schoolYear
    }
  }

}
