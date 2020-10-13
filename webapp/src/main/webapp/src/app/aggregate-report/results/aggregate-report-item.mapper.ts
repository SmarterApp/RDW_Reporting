import { Injectable } from '@angular/core';
import { AggregateReportItem } from './aggregate-report-item';
import {
  AggregateReportRow,
  AggregateReportRowMeasure
} from '../../report/aggregate-report';
import { OrganizationMapper } from '../../shared/organization/organization.mapper';
import { SubgroupMapper } from '../subgroup/subgroup.mapper';
import { SubjectDefinition } from '../../subject/subject';
import { AggregateReportQueryType } from '../../report/report';

/**
 * Maps server modeled aggregate report rows into client friendly table rows
 */
@Injectable()
export class AggregateReportItemMapper {
  constructor(
    private organizationMapper: OrganizationMapper,
    private subgroupMapper: SubgroupMapper
  ) {}

  createRow(
    query: AggregateReportQueryType,
    subjectDefinition: SubjectDefinition,
    row: any,
    uuid: number,
    measuresGetter: (row: AggregateReportRow) => AggregateReportRowMeasure
  ): AggregateReportItem {
    const item = new AggregateReportItem();
    const itemPerformanceLevelCounts =
      item.performanceLevelByDisplayTypes.Separate.Number;
    const itemPerformanceLevelPercents =
      item.performanceLevelByDisplayTypes.Separate.Percent;
    const itemGroupedPerformanceLevelCounts =
      item.performanceLevelByDisplayTypes.Grouped.Number;
    const itemGroupedPerformanceLevelPercents =
      item.performanceLevelByDisplayTypes.Grouped.Percent;

    item.itemId = uuid;
    item.assessmentId = row.assessment.id;
    item.assessmentLabel = row.assessment.label;
    item.assessmentGradeCode = row.assessment.gradeCode;
    item.subjectCode = row.assessment.subjectCode;
    item.schoolYear = row.assessment.examSchoolYear;
    item.organization = this.organizationMapper.map(row.organization);
    item.claimCode = row.claimCode;
    item.altScoreCode = row.altScoreCode;
    item.targetNaturalId = row.targetNaturalId;
    item.studentRelativeResidualScoresLevel =
      row.studentRelativeResidualScoresLevel;
    item.standardMetRelativeResidualLevel =
      row.standardMetRelativeResidualLevel;

    item.subgroup = this.subgroupMapper.fromAggregateReportRow(query, row);

    const measures: any = measuresGetter(row) || {};
    item.avgScaleScore = measures.avgScaleScore || 0;
    item.avgStdErr = measures.avgStdErr;
    item.studentsTested = measures.studentCount;

    for (
      let level = 1;
      level <= subjectDefinition.overallScore.levelCount;
      level++
    ) {
      const count = measures[`level${level}Count`] || 0;
      itemPerformanceLevelCounts.push(count);
    }

    for (let level = 0; level < itemPerformanceLevelCounts.length; level++) {
      const percent =
        item.studentsTested === 0
          ? 0
          : Math.floor(
              (itemPerformanceLevelCounts[level] / item.studentsTested) * 100
            );
      itemPerformanceLevelPercents.push(percent);
    }

    // If there is a rollup level, calculate the grouped values
    if (subjectDefinition.overallScore.standardCutoff > 0) {
      let belowCount = 0;
      let aboveCount = 0;
      for (let level = 0; level < itemPerformanceLevelCounts.length; level++) {
        if (level < subjectDefinition.overallScore.standardCutoff - 1) {
          belowCount += itemPerformanceLevelCounts[level];
        } else {
          aboveCount += itemPerformanceLevelCounts[level];
        }
      }

      itemGroupedPerformanceLevelCounts.push(belowCount);
      itemGroupedPerformanceLevelCounts.push(aboveCount);

      itemGroupedPerformanceLevelPercents.push(
        item.studentsTested === 0
          ? 0
          : Math.floor((belowCount / item.studentsTested) * 100)
      );
      itemGroupedPerformanceLevelPercents.push(
        item.studentsTested === 0
          ? 0
          : Math.floor((aboveCount / item.studentsTested) * 100)
      );
    }

    return item;
  }
}
