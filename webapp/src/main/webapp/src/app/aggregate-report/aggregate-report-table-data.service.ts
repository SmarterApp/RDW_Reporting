import { Injectable } from '@angular/core';
import { AggregateReportFormSettings } from './aggregate-report-form-settings';
import {
  DefaultDistrict,
  DefaultSchool,
  DefaultState,
  District,
  Organization,
  School,
  State
} from '../shared/organization/organization';
import { AssessmentDefinition } from './assessment/assessment-definition';
import { AggregateReportItem } from './results/aggregate-report-item';
import { TranslateService } from '@ngx-translate/core';
import { SubgroupMapper } from './subgroup/subgroup.mapper';
import { computeEffectiveYears } from './support';
import { AggregateReportOptions } from './aggregate-report-options';
import { Subgroup } from './subgroup/subgroup';

const MaximumOrganizations = 3;

@Injectable()
export class AggregateReportTableDataService {

  constructor(private translate: TranslateService,
              private subgroupMapper: SubgroupMapper) {
  }

  createSampleData(assessmentDefinition: AssessmentDefinition,
                   settings: AggregateReportFormSettings,
                   options: AggregateReportOptions): AggregateReportItem[] {

    const organizations = this.createSampleOrganizations(settings, assessmentDefinition);

    const gradesAndYears: { grade: string, year: number }[] = [];
    if (settings.reportType === 'GeneralPopulation' || assessmentDefinition.typeCode !== 'sum') {
      for (const grade of settings.generalPopulation.assessmentGrades) {
        for (const year of settings.generalPopulation.schoolYears) {
          gradesAndYears.push({ grade, year });
        }
      }
    } else if (settings.reportType === 'LongitudinalCohort' && assessmentDefinition.typeCode === 'sum') {
      const assessmentGrades = settings.longitudinalCohort.assessmentGrades;
      const schoolYears = computeEffectiveYears(settings.longitudinalCohort.toSchoolYear, assessmentGrades);
      for (let i = 0; i < assessmentGrades.length; i++) {
        gradesAndYears.push({ grade: assessmentGrades[ i ], year: schoolYears[ i ] });
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

    const createRows = (subgroups: Subgroup[]): AggregateReportItem[] => {
      let uuid = 0;
      const rows: AggregateReportItem[] = [];
      for (const organization of organizations) {
        for (const { grade, year } of gradesAndYears) {
          for (const subgroup of subgroups) {
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
              subgroup: subgroup
            };
            rows.push(row);
          }
        }
      }
      return rows;
    };

    if (settings.queryType === 'Basic') {
      const subgroups = [
        this.subgroupMapper.createOverall(),
        ...this.subgroupMapper.createPermutationsFromFilters(settings.studentFilters, settings.dimensionTypes)
      ];
      return createRows(subgroups);
    } else if (settings.queryType === 'FilteredSubgroup') {
      const subgroups = [
        this.subgroupMapper.createOverall(),
        ...settings.subgroups.map(subgroup => this.subgroupMapper.fromFilters(subgroup, options.dimensionTypes))
      ];
      return createRows(subgroups);
    }
    throw new Error(`Unsupported query type "${settings.queryType}"`);
  }

  private createSampleOrganizations(settings: AggregateReportFormSettings, definition: AssessmentDefinition): Organization[] {

    const organizations: Organization[] = [];

    if (settings.includeStateResults && definition.typeCode === 'sum') {
      organizations.push(this.createSampleState());
    }

    let schoolId = 1,
      districtId = 1;

    for (let i = 0; i < MaximumOrganizations && organizations.length < MaximumOrganizations; i++) {
      if (settings.districts.length >= districtId
        || settings.includeAllDistricts
        || (settings.schools.length && settings.includeAllDistrictsOfSelectedSchools)) {
        organizations.push(this.createSampleDistrict(districtId++));
      }

      if (settings.schools.length >= schoolId
        || ((settings.districts.length || settings.includeAllDistricts) && settings.includeAllSchoolsOfSelectedDistricts)) {
        organizations.push(this.createSampleSchool(schoolId++));
      }
    }

    return organizations;
  }

  private createSampleState(): State {
    const state = new DefaultState();
    state.name = this.translate.instant('sample-aggregate-table-data-service.state-name');
    return state;
  }

  private createSampleDistrict(id: number): District {
    const district = new DefaultDistrict();
    district.id = id;
    district.name = this.translate.instant('sample-aggregate-table-data-service.district-name', { id: id });
    return district;
  }

  private createSampleSchool(id: number): School {
    const school = new DefaultSchool();
    school.id = id;
    school.name = this.translate.instant('sample-aggregate-table-data-service.school-name', { id: id });
    school.districtId = id;
    return school;
  }

}



