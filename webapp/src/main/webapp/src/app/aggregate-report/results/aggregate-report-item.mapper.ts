import { Injectable } from "@angular/core";
import { AggregateReportItem } from "./aggregate-report-item";
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
    item.itemId = uuid;
    item.assessmentId = row.assessment.id;
    item.gradeId = row.assessment.gradeId;
    item.gradeCode = row.assessment.gradeCode;
    item.subjectId = row.assessment.subjectCode === 'Math' ? 1 : 2;
    item.subjectCode = row.assessment.subjectCode;
    item.schoolYear = row.assessment.examSchoolYear;
    item.organization = this.organizationMapper.map(row.organization);
    item.dimensionType = row.dimension.type;
    item.dimensionValue = row.dimension.code || 'default';

    const measures: any = row.measures || {};
    item.avgScaleScore = measures.avgScaleScore || 0;
    item.avgStdErr = measures.avgStdErr || 0;

    let totalTested: number = 0;
    for (let level = 1; level <= assessmentDefinition.performanceLevelCount; level++) {
      const count = measures[ `level${level}Count` ] || 0;
      totalTested += count;
      item.performanceLevelCounts.push(count);
    }
    item.studentsTested = totalTested;

    for (let level = 0; level < item.performanceLevelCounts.length; level++) {
      const percent = totalTested == 0 ? 0 : Math.floor((item.performanceLevelCounts[ level ] / totalTested) * 100);
      item.performanceLevelPercents.push(percent);
    }

    //If there is a rollup level, calculate the grouped values
    if (assessmentDefinition.performanceLevelGroupingCutPoint > 0) {
      let belowCount: number = 0;
      let aboveCount: number = 0;
      for (let level = 0; level < item.performanceLevelCounts.length; level++) {
        if (level < assessmentDefinition.performanceLevelGroupingCutPoint - 1) {
          belowCount += item.performanceLevelCounts[ level ];
        } else {
          aboveCount += item.performanceLevelCounts[ level ];
        }
      }
      item.groupedPerformanceLevelCounts.push(belowCount);
      item.groupedPerformanceLevelPercents.push(totalTested === 0 ? 0 : Math.floor((belowCount / totalTested) * 100));
      item.groupedPerformanceLevelCounts.push(aboveCount);
      item.groupedPerformanceLevelPercents.push(totalTested === 0 ? 0 : Math.floor((aboveCount / totalTested) * 100));
    }

    return item;
  }


}
