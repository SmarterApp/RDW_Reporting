import { Injectable } from "@angular/core";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { DefaultSchool, Organization, School } from "../shared/organization/organization";
import { AssessmentDefinition } from "./assessment/assessment-definition";
import { AggregateReportItem, Dimension } from "./results/aggregate-report-item";
import { Utils } from "../shared/support/support";
import { TranslateService } from "@ngx-translate/core";

const OverallDimension: Dimension = { id: 'Overall', type: 'Overall', includeType: true };

const codeOf = entity => entity.code;
const codesOf = entities => entities.map(codeOf);

// when adding a new dimension type one needs to be defined here
const DimensionConfigurationByType: { [dimensionType: string]: DimensionConfiguration } = {
  Gender: {
    getDimensionValueCodes: settings => codesOf(settings.genders),
    getTranslationCode: value => `common.gender.${value}`,
    includeType: true
  },
  Ethnicity: {
    getDimensionValueCodes: settings => codesOf(settings.ethnicities),
    getTranslationCode: value => `common.ethnicity.${value}`,
    includeType: true
  },
  LEP: {
    getDimensionValueCodes: settings => codesOf(settings.limitedEnglishProficiencies),
    getTranslationCode: value => `common.strict-boolean.${value}`,
    includeType: true
  },
  MigrantStatus: {
    getDimensionValueCodes: settings => codesOf(settings.migrantStatuses),
    getTranslationCode: value => `common.strict-boolean.${value}`,
    includeType: true
  },
  Section504: {
    getDimensionValueCodes: settings => codesOf(settings.section504s),
    getTranslationCode: value => `common.strict-boolean.${value}`,
    includeType: true
  },
  IEP: {
    getDimensionValueCodes: settings => codesOf(settings.individualEducationPlans),
    getTranslationCode: value => `common.strict-boolean.${value}`,
    includeType: true
  },
  EconomicDisadvantage: {
    getDimensionValueCodes: settings => codesOf(settings.economicDisadvantages),
    getTranslationCode: value => `common.strict-boolean.${value}`,
    includeType: true
  },
  StudentEnrolledGrade: {
    getDimensionValueCodes: settings => Utils.isNullOrEmpty(settings.assessmentGrades) ? [] : [ settings.assessmentGrades[0].code ],
    getTranslationCode: value => `common.grade.${value}.enrolled`,
    includeType: true
  }
};

@Injectable()
export class AggregateReportTableDataService {

  constructor(private translate: TranslateService) {
  }

  createSampleData(assessmentDefinition: AssessmentDefinition, settings: AggregateReportFormSettings): AggregateReportItem[] {
    const organizations = this.createSampleOrganizations([ ...settings.districts, ...settings.schools ].length);
    const assessmentGradeCodes = codesOf(settings.assessmentGrades);
    const schoolYears = settings.schoolYears;
    const dimensions = [ OverallDimension, ...this.createDimensions(settings) ];
    const studentsTested = 100;
    const averageScaleScore = 2500;
    const averageStandardError = 50;
    const performanceLevelCounts = [];
    const performanceLevelPercents = [];
    const performanceLevelCount = Math.floor(studentsTested / assessmentDefinition.performanceLevelCount);
    const performanceLevelPercent = Math.floor(100 / assessmentDefinition.performanceLevelCount);
    for (let i = 0; i < assessmentDefinition.performanceLevelCount; i++) {
      performanceLevelCounts.push(performanceLevelCount);
      performanceLevelPercents.push(performanceLevelPercent);
    }
    const groupedPerformanceLevelCount = studentsTested * 0.5;
    const groupedPerformanceLevelCounts = [ groupedPerformanceLevelCount, groupedPerformanceLevelCount ];

    let uuid = 0;
    const rows = [];
    for (let organization of organizations) {
      for (let assessmentGradeCode of assessmentGradeCodes) {
        for (let schoolYear of schoolYears) {
          for (let dimension of dimensions) {
            rows.push({
              itemId: ++uuid,
              organization: organization,
              assessmentId: undefined,
              gradeCode: assessmentGradeCode,
              subjectCode: undefined,
              schoolYear: schoolYear,
              avgScaleScore: averageScaleScore,
              avgStdErr: averageStandardError,
              studentsTested: studentsTested,
              performanceLevelByDisplayTypes: {
                Separate: {
                  Number: performanceLevelCounts,
                  Percent: performanceLevelPercents
                },
                Grouped: {
                  Number: groupedPerformanceLevelCounts,
                  Percents: groupedPerformanceLevelCounts
                }
              },
              dimensionType: dimension.type,
              dimensionValue: dimension.code,
              dimension: dimension
            });
          }
        }
      }
    }
    return rows;
  }

  // TODO outsource this logic to mapper ?
  private createDimensions(settings: AggregateReportFormSettings): Dimension[] {
    const dimensions = [];
    for (let dimensionType of settings.dimensionTypes) {
      const configuration = DimensionConfigurationByType[ dimensionType ];
      if (!configuration) {
        continue;
      }
      const codes = configuration.getDimensionValueCodes(settings);
      for (let code of codes) {
        dimensions.push({
          id: `${dimensionType}.${code}`,
          type: dimensionType,
          includeType: configuration.includeType,
          code: code,
          codeTranslationCode: configuration.getTranslationCode(code)
        });
      }
    }
    return dimensions;
  }

  private createSampleOrganizations(selectedOrganizationCount: number): Organization[] {
    const organizations: Organization[] = [];
    for (let i = 0; i < selectedOrganizationCount && i < 2; i++) {
      organizations.push(this.createSampleSchool(i + 1));
    }
    return organizations;
  }

  private createSampleSchool(id: number): School {
    const school = new DefaultSchool();
    school.id = id;
    school.name = this.translate.instant('sample-aggregate-table-data-service.organization-name-format', {id: id});
    school.districtId = id;
    return school;
  }

}

interface DimensionConfiguration {
  readonly getDimensionValueCodes: (settings: AggregateReportFormSettings) => string[];
  readonly getTranslationCode: (dimensionCode: string) => string;
  readonly includeType?: boolean;
}


