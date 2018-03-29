import { Injectable } from "@angular/core";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { DefaultSchool, Organization, School } from "../shared/organization/organization";
import { AssessmentDefinition } from "./assessment/assessment-definition";
import { AggregateReportItem } from "./results/aggregate-report-item";
import { TranslateService } from "@ngx-translate/core";
import {SubgroupMapper} from "./subgroup.mapper";

const MaximumOrganizations = 2;

@Injectable()
export class AggregateReportTableDataService {

  constructor(private translate: TranslateService,
              private subgroupMapper: SubgroupMapper) {
  }

  createSampleData(assessmentDefinition: AssessmentDefinition, settings: AggregateReportFormSettings): AggregateReportItem[] {
    const organizations = this.createSampleOrganizations(settings);
    const assessmentGradeCodes = settings.assessmentGrades;
    const schoolYears = settings.schoolYears;
    const dimensions = this.subgroupMapper.createSubgroups(['Overall', ...settings.dimensionTypes], settings);
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
    const rows: AggregateReportItem[] = [];
    for (let organization of organizations) {
      for (let assessmentGradeCode of assessmentGradeCodes) {
        for (let schoolYear of schoolYears) {
          for (let dimension of dimensions) {
            rows.push({
              itemId: ++uuid,
              organization: organization,
              assessmentId: undefined,
              assessmentLabel: this.translate.instant('sample-aggregate-table-data-service.assessment-label'),
              assessmentGradeCode: assessmentGradeCode,
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
                  Percent: groupedPerformanceLevelCounts
                }
              },
              dimension: dimension
            });
          }
        }
      }
    }
    return rows;
  }

  private createSampleOrganizations(settings: AggregateReportFormSettings): Organization[] {

    const organizationCount = (settings.includeStateResults ? 1 : 0)
      + (settings.includeAllDistricts ? MaximumOrganizations : 0)
      + [ ...settings.districts, ...settings.schools ].length;

    const organizations: Organization[] = [];
    for (let i = 0; i < organizationCount && i < MaximumOrganizations; i++) {
      organizations.push(this.createSampleOrganization(i + 1));
    }
    return organizations;
  }

  private createSampleOrganization(id: number): School {
    const school = new DefaultSchool();
    school.id = id;
    school.name = this.translate.instant('sample-aggregate-table-data-service.school-name', { id: id });
    school.districtId = id;
    return school;
  }

}


