import { Injectable } from "@angular/core";
import { AggregateReportItem, Dimension } from "./aggregate-report-item";
import { AggregateReportRow } from "../../report/aggregate-report";
import { AssessmentDefinition } from "../assessment/assessment-definition";
import { OrganizationMapper } from "../../shared/organization/organization.mapper";

/**
 * Maps server modeled aggregate report rows into client friendly table rows
 */
@Injectable()
export class AggregateReportItemMapper {

  constructor(private organizationMapper: OrganizationMapper) {
  }

  map(assessmentDefinition: AssessmentDefinition, row: AggregateReportRow, uuid: number): AggregateReportItem {
    const item = new AggregateReportItem();
    const itemPerformanceLevelCounts = item.performanceLevelByDisplayTypes.Separate.Number;
    const itemPerformanceLevelPercents = item.performanceLevelByDisplayTypes.Separate.Percent;
    const itemGroupedPerformanceLevelCounts = item.performanceLevelByDisplayTypes.Grouped.Number;
    const itemGroupedPerformanceLevelPercents = item.performanceLevelByDisplayTypes.Grouped.Percent;

    item.itemId = uuid;
    item.assessmentId = row.assessment.id;
    item.assessmentGradeCode = row.assessment.gradeCode;
    item.subjectCode = row.assessment.subjectCode;
    item.schoolYear = row.assessment.examSchoolYear;
    item.organization = this.organizationMapper.map(row.organization);
    item.dimension = this.mapDimension(row.dimension);

    const measures: any = row.measures || {};
    item.avgScaleScore = measures.avgScaleScore || 0;
    item.avgStdErr = measures.avgStdErr || 0;

    let totalTested: number = 0;

    for (let level = 1; level <= assessmentDefinition.performanceLevelCount; level++) {
      let count = measures[ `level${level}Count` ] || 0;
      totalTested += count;
      itemPerformanceLevelCounts.push(count);
    }
    item.studentsTested = totalTested;

    for (let level = 0; level < itemPerformanceLevelCounts.length; level++) {
      const percent = totalTested == 0 ? 0 : Math.floor((itemPerformanceLevelCounts[ level ] / totalTested) * 100);
      itemPerformanceLevelPercents.push(percent);
    }

    //If there is a rollup level, calculate the grouped values
    if (assessmentDefinition.performanceLevelGroupingCutPoint > 0) {
      let belowCount: number = 0;
      let aboveCount: number = 0;
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

  private mapDimension(dimension: any): Dimension {
    return {
      id: `${dimension.type}.${dimension.code}`,
      type: dimension.type,
      includeType: true,
      code: dimension.code,
      codeTranslationCode: dimension.code // TODO
    };
  }


}
