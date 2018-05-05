import { Injectable } from '@angular/core';
import { AggregateReportItem } from './aggregate-report-item';
import {
  AggregateReportRow,
  AggregateReportRowDimension,
  AggregateReportRowMeasure
} from '../../report/aggregate-report';
import { AssessmentDefinition } from '../assessment/assessment-definition';
import { OrganizationMapper } from '../../shared/organization/organization.mapper';
import { SubgroupMapper } from '../subgroup/subgroup.mapper';
import {
  AggregateReportQuery, StudentFilters
} from '../../report/aggregate-report-request';
import { AggregateReportRequestMapper } from '../aggregate-report-request.mapper';
import { Subgroup } from '../subgroup/subgroup';

/**
 * Maps server modeled aggregate report rows into client friendly table rows
 */
@Injectable()
export class AggregateReportItemMapper {

  constructor(private organizationMapper: OrganizationMapper,
              private subgroupMapper: SubgroupMapper,
              private requestMapper: AggregateReportRequestMapper) {
  }

  createRow(query: AggregateReportQuery,
            assessmentDefinition: AssessmentDefinition,
            row: AggregateReportRow,
            uuid: number): AggregateReportItem {

    return this.createRowInternal(query, assessmentDefinition, row, uuid, (row) => row.measures);
  }

  createRowUsingCohortMeasures(query: AggregateReportQuery,
                               assessmentDefinition: AssessmentDefinition,
                               row: AggregateReportRow,
                               uuid: number): AggregateReportItem {

    return this.createRowInternal(query, assessmentDefinition, row, uuid, (row) => row.cohortMeasures);
  }

  private createRowInternal(query: AggregateReportQuery, assessmentDefinition: AssessmentDefinition, row: AggregateReportRow, uuid: number, measuresGetter: (row: AggregateReportRow) => AggregateReportRowMeasure): AggregateReportItem {
    const item = new AggregateReportItem();
    const itemPerformanceLevelCounts = item.performanceLevelByDisplayTypes.Separate.Number;
    const itemPerformanceLevelPercents = item.performanceLevelByDisplayTypes.Separate.Percent;
    const itemGroupedPerformanceLevelCounts = item.performanceLevelByDisplayTypes.Grouped.Number;
    const itemGroupedPerformanceLevelPercents = item.performanceLevelByDisplayTypes.Grouped.Percent;

    item.itemId = uuid;
    item.assessmentId = row.assessment.id;
    item.assessmentLabel = row.assessment.label;
    item.assessmentGradeCode = row.assessment.gradeCode;
    item.subjectCode = row.assessment.subjectCode;
    item.schoolYear = row.assessment.examSchoolYear;
    item.organization = this.organizationMapper.map(row.organization);

    item.subgroup = this.subgroupMapper.fromAggregateReportRow(query, row);

    const measures: any = measuresGetter(row) || {};
    item.avgScaleScore = measures.avgScaleScore || 0;
    item.avgStdErr = measures.avgStdErr || 0;

    let totalTested = 0;

    for (let level = 1; level <= assessmentDefinition.performanceLevelCount; level++) {
      const count = measures[ `level${level}Count` ] || 0;
      totalTested += count;
      itemPerformanceLevelCounts.push(count);
    }
    item.studentsTested = totalTested;

    for (let level = 0; level < itemPerformanceLevelCounts.length; level++) {
      const percent = totalTested === 0 ? 0 : Math.floor((itemPerformanceLevelCounts[ level ] / totalTested) * 100);
      itemPerformanceLevelPercents.push(percent);
    }

    // If there is a rollup level, calculate the grouped values
    if (assessmentDefinition.performanceLevelGroupingCutPoint > 0) {
      let belowCount = 0;
      let aboveCount = 0;
      for (let level = 0; level < itemPerformanceLevelCounts.length; level++) {
        if (level < assessmentDefinition.performanceLevelGroupingCutPoint - 1) {
          belowCount += itemPerformanceLevelCounts[ level ];
        } else {
          aboveCount += itemPerformanceLevelCounts[ level ];
        }
      }

      itemGroupedPerformanceLevelCounts.push(belowCount);
      itemGroupedPerformanceLevelCounts.push(aboveCount);

      itemGroupedPerformanceLevelPercents.push(totalTested === 0 ? 0 : Math.floor((belowCount / totalTested) * 100));
      itemGroupedPerformanceLevelPercents.push(totalTested === 0 ? 0 : Math.floor((aboveCount / totalTested) * 100));
    }

    return item;
  }

}
