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
import { ColorService } from '../../shared/color.service';
import { LongitudinalReport } from '../aggregate-report.service';
import { AggregateReportRow, AggregateReportRowMeasure } from '../../report/aggregate-report';
import { OrganizationMapper } from '../../shared/organization/organization.mapper';
import { SubgroupMapper } from '../subgroup/subgroup.mapper';
import { AggregateReportQuery } from '../../report/aggregate-report-request';
import { Assessment } from '../assessment/assessment';
import { ordering } from '@kourge/ordering';
import { byNumber, join } from '@kourge/ordering/comparator';
import { SubjectDefinition } from '../../subject/subject';


const rowYearAscending = ordering(byNumber).on<AggregateReportRow>(row => row.assessment.examSchoolYear).compare;
const assessmentGradeAscending = ordering(byNumber).on<Assessment>(assessment => assessment.gradeSequence).compare;
const assessmentYearDescending = ordering(byNumber).on<Assessment>( assessment => assessment.schoolYear).reverse().compare;

@Injectable()
export class LongitudinalCohortChartMapper {

  constructor(private translate: TranslateService,
              private organizationMapper: OrganizationMapper,
              private subgroupMapper: SubgroupMapper) {
  }

  /**
   * Creates a chart from a longitudinal cohort report
   *
   * @param {AggregateReportQuery} query the query used to create the report
   * @param {LongitudinalReport} report the report data
   * @param measuresGetter defines whether to get the measures or the cohortMeasures from the row
   * @returns {LongitudinalCohortChart} the resulting chart
   */
  fromReport(query: AggregateReportQuery, report: LongitudinalReport, measuresGetter: (row: AggregateReportRow) => AggregateReportRowMeasure, subjectDefinition: SubjectDefinition): LongitudinalCohortChart {
    if (report.rows.length === 0
      || report.assessments.length === 0) {
      return { performanceLevels: [], organizationPerformances: [] };
    }
    return {
      organizationPerformances: this.createOrganizationPerformances(query, report.rows, measuresGetter),
      performanceLevels: this.createPerformanceLevels(report.assessments, subjectDefinition)
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

  private createPerformanceLevels(assessments: Assessment[], subjectDefinition: SubjectDefinition): PerformanceLevel[] {

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
              name: this.translate.instant(`subject.${subjectDefinition.subject}.asmt-type.${assessmentType}.level.${level}.short-name`),
              color: this.translate.instant(`subject.${subjectDefinition.subject}.asmt-type.${assessmentType}.level.${level}.color`),
              yearGradeScaleScoreRanges: [ range ]
            });
          }
        });
      });

    return performanceLevels;
  }

}
