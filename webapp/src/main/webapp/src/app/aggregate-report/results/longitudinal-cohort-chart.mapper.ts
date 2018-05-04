import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  LongitudinalCohortChart,
  OrganizationPerformance,
  PerformanceLevel,
  YearGrade, YearGradeScaleScore, YearGradeScaleScoreRange
} from './longitudinal-cohort-chart';
import { DefaultSchool, Organization } from '../../shared/organization/organization';
import { ColorService } from '../../shared/color.service';


function createStubGradeYears(first: YearGrade, count: number, step: number = 1, initialGap: number = 0) {
  const yearsAndGrades = [ first ];
  for (let i = 1 + initialGap; i < count; i++) {
    yearsAndGrades.push({
      year: first.year + i * step,
      grade: first.grade + i * step
    });
  }
  return yearsAndGrades;
}

function createStubPerformanceLevels(count: number,
                                     yearGrades: YearGrade[],
                                     scaleScoreRange: number[],
                                     performanceLevelNameProvider: (level: number) => string,
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
        scaleScore: Math.floor(previous + 50 + 25 * Math.random())
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

@Injectable()
export class LongitudinalCohortChartMapper {

  constructor(private translate: TranslateService,
              private colorService: ColorService) {
  }

  createStubChart(assessmentTypeCode: string = 'sum'): LongitudinalCohortChart {
    const scaleScoreRange = [ 2000, 2800 ];
    const yearGrades = createStubGradeYears({ year: 2000, grade: 3 }, 10, 1, 4);
    const nameProvider = (level) => this.translate
      .instant(`common.assessment-type.${assessmentTypeCode}.performance-level.${level}.name-prefix`);
    const colorProvider = (level) => this.colorService
      .getPerformanceLevelColorsByAssessmentTypeCode(assessmentTypeCode, level);

    return {
      performanceLevels: createStubPerformanceLevels(4, yearGrades, scaleScoreRange, nameProvider, colorProvider),
      organizationPerformances: createStubOrganizationPerformances(3, yearGrades, scaleScoreRange)
    };
  }

}
