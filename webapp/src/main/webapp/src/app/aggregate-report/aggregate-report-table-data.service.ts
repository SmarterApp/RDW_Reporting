import { Injectable } from "@angular/core";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { DefaultSchool, Organization, School } from "../shared/organization/organization";
import { AssessmentDefinition } from "./assessment/assessment-definition";
import { AggregateReportItem } from "./results/aggregate-report-item";
import { TranslateService } from "@ngx-translate/core";
import {SubgroupMapper} from "./subgroup.mapper";
import { computeEffectiveYears } from './support';

const MaximumOrganizations = 2;

@Injectable()
export class AggregateReportTableDataService {

  constructor(private translate: TranslateService,
              private subgroupMapper: SubgroupMapper) {
  }

  createSampleData(assessmentDefinition: AssessmentDefinition, settings: AggregateReportFormSettings): AggregateReportItem[] {
    const organizations = this.createSampleOrganizations(settings);

    const gradesAndYears: {grade: string, year: number}[] = [];
    if (settings.reportType === 'GeneralPopulation') {
      for (const grade of settings.generalPopulation.assessmentGrades) {
        for (const year of settings.generalPopulation.schoolYears) {
          gradesAndYears.push({grade, year});
        }
      }
    } else if (settings.reportType === 'LongitudinalCohort') {
      const assessmentGrades = settings.longitudinalCohort.assessmentGrades;
      const schoolYears = computeEffectiveYears(settings.longitudinalCohort.toSchoolYear, assessmentGrades);
      for (let i = 0; i < assessmentGrades.length; i++) {
        gradesAndYears.push({grade: assessmentGrades[i], year: schoolYears[i]});
      }
    }

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

    const createRows = (values: {id: string, name: string}[]): AggregateReportItem[] => {
      let uuid = 0;
      const rows: AggregateReportItem[] = [];
      for (const organization of organizations) {
        for (const {grade, year} of gradesAndYears) {
          for (const value of values) {
            const row: any = {
              itemId: ++uuid,
              organization: organization,
              assessmentId: undefined,
              assessmentLabel: this.translate.instant('sample-aggregate-table-data-service.assessment-label'),
              assessmentGradeCode: grade,
              subjectCode: undefined,
              schoolYear: year,
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
              dimension: value
            };
            rows.push(row);
          }
        }
      }
      return rows;
    };

    if (settings.queryType === 'Basic') {
      const dimensions = this.subgroupMapper.createDimensionPermutations(
        settings.studentFilters,
        ['Overall', ...settings.dimensionTypes]
      );
      return createRows(dimensions);
    } else if (settings.queryType === 'FilteredSubgroup') {
      const subgroups = [
        this.subgroupMapper.createOverallSubgroupFiltersListItem()
      ].concat(
        settings.subgroups.map(subgroup => this.subgroupMapper.createSubgroupFiltersListItem(subgroup))
      );
      return createRows(subgroups);
    }
    throw new Error(`Unsupported query type "${settings.queryType}"`);
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



