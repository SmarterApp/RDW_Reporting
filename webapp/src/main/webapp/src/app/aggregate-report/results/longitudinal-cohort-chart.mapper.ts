import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  LongitudinalCohortChart,
  OrganizationPerformance,
  PerformanceLevel,
  YearGrade,
  YearGradeScaleScore,
  YearGradeScaleScoreRange
} from './longitudinal-cohort-chart';
import { DefaultSchool, Organization } from '../../shared/organization/organization';
import { ColorService } from '../../shared/color.service';
import { LongitudinalReport } from '../aggregate-report.service';
import { AggregateReportRow, AggregateReportRowMeasure } from '../../report/aggregate-report';
import { OrganizationMapper } from '../../shared/organization/organization.mapper';
import { SubgroupMapper } from '../subgroup/subgroup.mapper';
import { AggregateReportQuery } from '../../report/aggregate-report-request';
import { Assessment } from '../assessment/assessment';
import { ordering } from '@kourge/ordering';
import { byNumber, join } from '@kourge/ordering/comparator';


function createStubGradeYears(first: YearGrade, count: number, step: number = 1, initialGap: number = 0) {
  const yearsAndGrades = [ first ];
  for (let i = 1 + initialGap; i < count; i++) {
    yearsAndGrades.push({
      year: first.year + i * step,
      grade: String(Number.parseInt(first.grade) + i * step)
    });
  }
  return yearsAndGrades;
}

function createStubPerformanceLevels(count: number,
                                     yearGrades: YearGrade[],
                                     scaleScoreRange: number[],
                                     performanceLevelNameProvider: (level: number) => string,
                                     performanceLevelNamePrefixProvider: (level: number) => string,
                                     performanceLevelColorProvider: (level: number) => string): PerformanceLevel[] {

  const [ minimumScaleScore ] = scaleScoreRange;
  const areas = [];
  for (let i = 0; i < count; i++) {
    const area = [];
    for (let j = 0; j < yearGrades.length; j++) {

      const previous = areas[ i - 1 ] != null
      && areas[ i - 1 ].yearGradeScaleScoreRanges != null
      && areas[ i - 1 ].yearGradeScaleScoreRanges[ j ] != null
        ? areas[ i - 1 ].yearGradeScaleScoreRanges[ j ].scaleScoreRange.maximum
        : Math.floor(minimumScaleScore + 10 * j + 25 * Math.random());

      const gradeYear = yearGrades[ j ];
      area.push(<YearGradeScaleScoreRange>{
        yearGrade: gradeYear,
        scaleScoreRange: {
          minimum: previous,
          maximum: Math.floor(previous + 125 + 50 * Math.random())
        }
      });
    }
    const level = i + 1;
    areas.push(<PerformanceLevel>{
      id: level,
      name: performanceLevelNameProvider(level),
      namePrefix: performanceLevelNamePrefixProvider(level),
      color: performanceLevelColorProvider(level),
      yearGradeScaleScoreRanges: area
    });
  }
  return areas;
}

function createStubOrganizationPerformances(count: number,
                                            yearGrades: YearGrade[],
                                            scaleScoreRange: number[]): OrganizationPerformance[] {

  const [ minimumScaleScore, maximumScaleScore ] = scaleScoreRange;
  const spread = maximumScaleScore - minimumScaleScore;
  const lines = [];
  for (let i = 0; i < count; i++) {
    const line = [];
    for (let j = 0; j < yearGrades.length; j++) {
      const yearGrade = yearGrades[ j ];

      const previous = lines[ i - 1 ] != null
      && lines[ i - 1 ].yearGradeScaleScores != null
      && lines[ i - 1 ].yearGradeScaleScores[ j ] != null
        ? lines[ i - 1 ].yearGradeScaleScores[ j ].scaleScore
        : minimumScaleScore + spread * 0.2 + spread * 0.02 * j + spread * 0.2 * Math.random();

      line.push(<YearGradeScaleScore>{
        yearGrade: yearGrade,
        scaleScore: Math.floor(previous + 50 + 25 * Math.random()),
        standardError: Math.floor(Math.max(maximumScaleScore - this.scaleScore, minimumScaleScore + this.scaleScore))
      });

    }
    lines.push(<OrganizationPerformance>{
      organization: createOrganization(i + 1),
      yearGradeScaleScores: line
    });
  }

  return lines;
}

function createOrganization(id: number): Organization {
  const organization = new DefaultSchool();
  organization.id = id;
  organization.name = `School name ${id}`;
  return organization;
}

const rowYearAscending = ordering(byNumber).on<AggregateReportRow>(row => row.assessment.examSchoolYear).compare;
const assessmentGradeAscending = ordering(byNumber).on<Assessment>(assessment => assessment.gradeSequence).compare;
const assessmentYearDescending = ordering(byNumber).on<Assessment>( assessment => assessment.schoolYear).reverse().compare;

@Injectable()
export class LongitudinalCohortChartMapper {

  constructor(private translate: TranslateService,
              private organizationMapper: OrganizationMapper,
              private subgroupMapper: SubgroupMapper,
              private colorService: ColorService) {
  }

  createStubChart(assessmentTypeCode: string = 'sum'): LongitudinalCohortChart {
    const scaleScoreRange = [ 2000, 2800 ];
    const yearGrades = createStubGradeYears({ year: 2000, grade: '03' }, 10, 1, 4);
    const nameProvider = (level) => this.translate
      .instant(`common.assessment-type.${assessmentTypeCode}.performance-level.${level}.name`);
    const namePrefixProvider = (level) => this.translate
      .instant(`common.assessment-type.${assessmentTypeCode}.performance-level.${level}.name-prefix`);
    const colorProvider = (level) => this.colorService
      .getPerformanceLevelColorsByAssessmentTypeCode(assessmentTypeCode, level);

    return {
      performanceLevels: createStubPerformanceLevels(4, yearGrades, scaleScoreRange, nameProvider, namePrefixProvider, colorProvider),
      organizationPerformances: createStubOrganizationPerformances(3, yearGrades, scaleScoreRange)
    };
  }

  /**
   * Creates a chart from a longitudinal cohort report
   *
   * @param {AggregateReportQuery} query the query used to create the report
   * @param {LongitudinalReport} report the report data
   * @param measuresGetter defines whether to get the measures or the cohortMeasures from the row
   * @returns {LongitudinalCohortChart} the resulting chart
   */
  fromReport(query: AggregateReportQuery, report: LongitudinalReport, measuresGetter: (row: AggregateReportRow) => AggregateReportRowMeasure): LongitudinalCohortChart {
    if (report.rows.length === 0
      || report.assessments.length === 0) {
      return { performanceLevels: [], organizationPerformances: [] };
    }
    return {
      organizationPerformances: this.createOrganizationPerformances(query, report.rows, measuresGetter),
      performanceLevels: this.createPerformanceLevels(report.assessments)
    };
  }

  private createOrganizationPerformances(query: AggregateReportQuery, rows: AggregateReportRow[],
                                         measuresGetter: (row: AggregateReportRow) => AggregateReportRowMeasure): OrganizationPerformance[] {

    const performanceByOrganizationSubgroup: Map<string, OrganizationPerformance> = new Map();
    const overall = this.subgroupMapper.createOverall();
    const keyGenerator = query.subgroups == null
      ? row => `${row.organization.id}:${row.organization.organizationType}:${row.dimension.type}:${row.dimension.code}`
      : row => `${row.organization.id}:${row.organization.organizationType}:${row.dimension.code}`;

    rows.concat()
      .sort(rowYearAscending)
      .forEach((row: AggregateReportRow) => {

        const measures: any = measuresGetter(row) || {};
        const yearGradeScaleScore = <YearGradeScaleScore>{
          yearGrade: <YearGrade>{
            year: row.assessment.examSchoolYear,
            grade: row.assessment.gradeCode
          },
          scaleScore: measures.avgScaleScore,
          standardError: measures.avgStdErr
        };

        const key = keyGenerator(row);
        const performance = performanceByOrganizationSubgroup.get(key);
        if (performance != null) {
          performance.yearGradeScaleScores.push(yearGradeScaleScore);
        } else {
          performanceByOrganizationSubgroup.set(key, <OrganizationPerformance>{
            organization: this.organizationMapper.map(row.organization),
            subgroup: this.subgroupMapper.fromAggregateReportRow(query, row, overall),
            yearGradeScaleScores: [ yearGradeScaleScore ]
          });
        }
      });

    return Array.from(performanceByOrganizationSubgroup.values());
  }

  private createPerformanceLevels(assessments: Assessment[]): PerformanceLevel[] {

    const performanceLevels = [];
    const assessmentType = assessments[ 0 ].type;
    const grades = new Set<string>();

    assessments.concat()
      .sort(join(assessmentGradeAscending, assessmentYearDescending))
      .forEach(assessment => {
        // there is an edge case where multiple assessments are returned for a grade, so we only want to take one of them
        if (grades.has(assessment.grade)) return;

        grades.add(assessment.grade);
        assessment.cutPoints.forEach((cutPoint, index, cutPoints) => {

          const nextCutPoint = cutPoints[ index + 1 ];
          if (nextCutPoint == null) {
            return;
          }

          const range = <YearGradeScaleScoreRange>{
            yearGrade: {
              year: assessment.schoolYear,
              grade: assessment.grade
            },
            scaleScoreRange: {
              minimum: cutPoint,
              maximum: nextCutPoint
            }
          };

          const performanceLevel = performanceLevels[ index ];
          if (performanceLevel != null) {
            performanceLevel.yearGradeScaleScoreRanges.push(range);
          } else {
            const level = index + 1;
            performanceLevels.push(<PerformanceLevel>{
              id: level,
              name: this.translate.instant(`common.assessment-type.${assessmentType}.performance-level.${level}.name`),
              namePrefix: this.translate.instant(`common.assessment-type.${assessmentType}.performance-level.${level}.name-prefix`),
              color: this.colorService.getPerformanceLevelColorsByAssessmentTypeCode(assessmentType, level),
              yearGradeScaleScoreRanges: [ range ]
            });
          }
        });
      });

    return performanceLevels;
  }

}
