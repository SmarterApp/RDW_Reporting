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
import { Claim } from './aggregate-report-options.service';
import { AggregateReportService } from './aggregate-report.service';
import { Utils } from "../shared/support/support";

const MaximumOrganizations = 3;

@Injectable()
export class AggregateReportTableDataService {

  private defaultOrganizationProvider: ValueProvider = {
    getValues: (context) => this.createSampleOrganizations(context.settings, context.assessmentDefinition)
      .map(organization => <any>{organization: organization})
  };

  private defaultSubgroupProvider: ValueProvider = {
    getValues: (context) => {
      let subgroups: Subgroup[];
      if (context.settings.queryType === 'Basic') {
        subgroups = [
          this.subgroupMapper.createOverall(),
          ...this.subgroupMapper.createPermutationsFromFilters(context.settings.studentFilters, context.settings.dimensionTypes)
        ]
      } else if (context.settings.queryType === 'FilteredSubgroup') {
        subgroups = [
          this.subgroupMapper.createOverall(),
          ...context.settings.subgroups.map(subgroup => this.subgroupMapper.fromFilters(subgroup, context.options.dimensionTypes))
        ]
      }
      return subgroups.map(subgroup => <any>{subgroup: subgroup});
    }
  };

  private defaultPerformanceLevelProvider: ValueProvider = {
    getValues: (context) => {
      const studentsTested = context.row.studentsTested;
      const performanceLevelCounts = [];
      const performanceLevelPercents = [];
      const performanceLevelCount = Math.floor(studentsTested / context.assessmentDefinition.performanceLevelCount);
      const performanceLevelPercent = Math.floor(100 / context.assessmentDefinition.performanceLevelCount);
      for (let i = 0; i < context.assessmentDefinition.performanceLevelCount; i++) {
        performanceLevelCounts.push(performanceLevelCount);
        performanceLevelPercents.push(performanceLevelPercent);
      }
      const groupedPerformanceLevelCount = studentsTested * 0.5;
      const groupedPerformanceLevelCounts = [ groupedPerformanceLevelCount, groupedPerformanceLevelCount ];

      return [{
        performanceLevelByDisplayTypes: {
          Grouped: {
            Number: groupedPerformanceLevelCounts,
              Percent: groupedPerformanceLevelCounts
          },
          Separate: {
            Number: performanceLevelCounts,
              Percent: performanceLevelPercents
          },
        }
      }];
    }
  };

  constructor(private translate: TranslateService,
              private subgroupMapper: SubgroupMapper,
              private reportService: AggregateReportService) {
  }

  createSampleData(assessmentDefinition: AssessmentDefinition,
                    settings: AggregateReportFormSettings,
                    options: AggregateReportOptions): AggregateReportItem[] {

    let valueProviders: ValueProvider[] = [];
    switch (this.reportService.getEffectiveReportType(settings.reportType, assessmentDefinition)) {

      case 'GeneralPopulation':
        valueProviders.push(
          this.defaultOrganizationProvider,
          this.defaultSubgroupProvider,
          this.defaultPerformanceLevelProvider, {
            getValues: (context) => context.settings.generalPopulation.assessmentGrades
              .map((grade: string) => <any>{ assessmentGradeCode: grade })
          }, {
            getValues: (context) => context.settings.generalPopulation.schoolYears
              .map(year => <any>{ schoolYear: year })
          });
        break;

      case 'LongitudinalCohort':
        valueProviders.push(
          this.defaultOrganizationProvider,
          this.defaultSubgroupProvider,
          this.defaultPerformanceLevelProvider, {
            getValues: (context) => {
              const gradeAndYears: { assessmentGradeCode: string, schoolYear: number }[] = [];
              const assessmentGrades = context.settings.longitudinalCohort.assessmentGrades;
              const schoolYears = computeEffectiveYears(context.settings.longitudinalCohort.toSchoolYear, assessmentGrades);
              for (let i = 0; i < assessmentGrades.length; i++) {
                gradeAndYears.push({
                  assessmentGradeCode: assessmentGrades[ i ],
                  schoolYear: schoolYears[ assessmentGrades.length - 1 - i ]
                });
              }
              return gradeAndYears;
            }
          });
        break;

      case 'Claim':
        valueProviders.push(
          this.defaultOrganizationProvider,
          this.defaultSubgroupProvider, {
            getValues: (context) => {
              // Strip out grouped performance level results
              const bothDisplayTypes = this.defaultPerformanceLevelProvider.getValues(context)[0];
              delete bothDisplayTypes.performanceLevelByDisplayTypes.Grouped;
              return [ bothDisplayTypes ];
            }
          }, {
            getValues: (context) => [ {subjectCode: context.settings.subjects[0]} ]
          }, {
            getValues: (context) => context.settings.claimReport.assessmentGrades
              .map(grade => <any>{ assessmentGradeCode: grade })
          }, {
            getValues: (context) => context.settings.claimReport.schoolYears
              .map(year => <any>{ schoolYear: year })
          }, {
            getValues: (context) => {
              const assessmentTypeCode: string = context.settings.assessmentType;
              const claims: Claim[] = context.settings.claimReport.claimCodesBySubject.length === 0
                ? options.claims
                : settings.claimReport.claimCodesBySubject;

              const subjectCode: string = context.settings.subjects
                .filter((subject) => !Utils.isNullOrUndefined(claims.find((claim) => claim.subject === subject)))
                .find(subject => true);

              return claims
                .filter(claim => claim.assessmentType === assessmentTypeCode && claim.subject === subjectCode)
                .map(claim => <any>{
                  subjectCode: subjectCode,
                  claimCode: claim.code
                });
            }
          });
        break;

      case 'Target':
        valueProviders.push(
          this.defaultSubgroupProvider, {
            getValues: (context) => [ {
              assessmentGradeCode: context.settings.targetReport.assessmentGrade,
              schoolYear: context.settings.targetReport.schoolYear,
              subjectCode: context.settings.targetReport.subjectCode
            } ]
          }, {
            getValues: (context) => [ {
              claimCode: 'A'
            }, {
              claimCode: 'B'
            } ]
          }, {
            getValues: (context) => [ {
              targetNaturalId: 'A',
              studentRelativeResidualScoresLevel: 'Above',
              standardMetRelativeResidualLevel: 'Above'
            }, {
              targetNaturalId: 'B',
              studentRelativeResidualScoresLevel: 'Near',
              standardMetRelativeResidualLevel: 'Near'
            }, {
              targetNaturalId: 'C',
              studentRelativeResidualScoresLevel: 'Below',
              standardMetRelativeResidualLevel: 'Below'
            }, {
              targetNaturalId: 'D',
              studentRelativeResidualScoresLevel: 'InsufficientData',
              standardMetRelativeResidualLevel: 'InsufficientData'
            }, {
              targetNaturalId: 'E',
              studentRelativeResidualScoresLevel: 'Excluded',
              standardMetRelativeResidualLevel: 'Excluded'
            } ]
          });
    }

    const rowTemplate: AggregateReportItem = this.createRowTemplate();
    return this.createRows(rowTemplate, valueProviders, {
      assessmentDefinition: assessmentDefinition,
      settings: settings,
      options: options,
      itemId: 1
    });
  }

  private createRowTemplate(): AggregateReportItem {
    const studentsTested = 100;
    const averageScaleScore = 2500;
    const averageStandardError = 50;

    return {
      assessmentId: undefined,
      assessmentLabel: this.translate.instant('sample-aggregate-table-data-service.assessment-label'),
      assessmentGradeCode: undefined,
      avgScaleScore: averageScaleScore,
      avgStdErr: averageStandardError,
      claimCode: undefined,
      itemId: undefined,
      organization: this.createSampleDistrict(1),
      performanceLevelByDisplayTypes: undefined,
      schoolYear: undefined,
      standardMetRelativeResidualLevel: undefined,
      studentRelativeResidualScoresLevel: undefined,
      studentsTested: studentsTested,
      subgroup: undefined,
      subjectCode: undefined
    }
  }

  private createRows(row: AggregateReportItem, valueProviders: ValueProvider[], context: RowContext): AggregateReportItem[] {
    let items: AggregateReportItem[] = [];
    if (valueProviders.length === 0) {
      row.itemId = context.itemId++;
      return [ row ];
    }

    const valueProvider: ValueProvider = valueProviders.shift();
    for (let values of valueProvider.getValues(context)) {
      row = Object.assign({}, row, values);
      context.row = row;
      items = items.concat(this.createRows(row, valueProviders, context));
    }
    valueProviders.unshift(valueProvider);
    return items;
  }

  private createSampleOrganizations(settings: AggregateReportFormSettings, definition: AssessmentDefinition): Organization[ ] {

    const organizations: Organization[] = [];

    if (settings.includeStateResults && definition.aggregateReportStateResultsEnabled) {
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
        organizations.push(this.createSampleSchool(schoolId++, districtId - 1));
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

  private createSampleSchool(id: number, districtId: number): School {
    const school = new DefaultSchool();
    school.id = id;
    school.name = this.translate.instant('sample-aggregate-table-data-service.school-name', { id: id });
    school.districtId = districtId;
    return school;
  }
}

interface ValueProvider {
  getValues: (context: RowContext) => any[];
}

class RowContext {
  assessmentDefinition: AssessmentDefinition;
  settings: AggregateReportFormSettings;
  options: AggregateReportOptions;
  itemId: number;
  row?: AggregateReportItem;
}
