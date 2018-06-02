import { Injectable } from '@angular/core';
import { SubgroupMapper } from '../../aggregate-report/subgroup/subgroup.mapper';
import { AggregateTargetScoreRow, TargetReportingLevel } from '../model/aggregate-target-score-row.model';
import { TargetScoreExam } from '../model/target-score-exam.model';
import { Exam } from '../model/exam.model';
import { ExamStatisticsCalculator } from './exam-statistics-calculator';

@Injectable()
export class TargetStatisticsCalculator {
  constructor(private examStatisticsCalculator: ExamStatisticsCalculator,
              private subgroupMapper: SubgroupMapper) {
  }

  aggregateTargetScores(targetScoreExams: TargetScoreExam[], subgroups: string[] = []): AggregateTargetScoreRow[] {
    if (targetScoreExams == null) return [];

    let grouped = targetScoreExams.reduce((groupedExams, exam) => {
      let index = groupedExams.findIndex(x => x.targetId == exam.targetId);
      if (index === -1) {
        groupedExams.push({
          targetId: exam.targetId,
          subgroup: this.subgroupMapper.createOverall(),
          subgroupCode: 'Overall',
          subgroupValue: null,
          standardMetScores:[],
          studentScores: []
        });

        index = groupedExams.length - 1;
      }

      groupedExams[ index ].standardMetScores.push(exam.standardMetRelativeResidualScore);
      groupedExams[ index ].studentScores.push(exam.studentRelativeResidualScore);

      // for each subgroup (Gender, Ethnicity, etc.) breakdown by all subgroup values
      subgroups.forEach(subgroupCode => {
        let subgroupValue = this.getExamSubgroupValue(exam, subgroupCode);

        let index = groupedExams.findIndex(x => x.targetId == exam.targetId
          && x.subgroupCode == subgroupCode && x.subgroupValue == subgroupValue);

        if (index === -1) {
          groupedExams.push({
            targetId: exam.targetId,
            subgroup: this.subgroupMapper.fromTypeAndCode(subgroupCode, subgroupValue),
            subgroupCode: subgroupCode,
            subgroupValue: subgroupValue,
            standardMetScores:[],
            studentScores: []
          });

          index = groupedExams.length - 1;
        }

        groupedExams[ index ].standardMetScores.push(exam.standardMetRelativeResidualScore);
        groupedExams[ index ].studentScores.push(exam.studentRelativeResidualScore);
      });

      return groupedExams;
    }, []);

    let rows = grouped.map(entry => {
      return <AggregateTargetScoreRow>{
        targetId: entry.targetId,
        subgroup: entry.subgroup,
        subgroupValue: entry.subgroupCode + '|' + entry.subgroupValue,
        studentsTested: entry.standardMetScores.length,
        standardMetRelativeLevel: this.mapTargetScoreDeltaToReportingLevel(
          this.examStatisticsCalculator.calculateAverage(entry.standardMetScores),
          this.examStatisticsCalculator.calculateStandardErrorOfTheMean(entry.standardMetScores)
        ),
        studentRelativeLevel: this.mapTargetScoreDeltaToReportingLevel(
          this.examStatisticsCalculator.calculateAverage(entry.studentScores),
          this.examStatisticsCalculator.calculateStandardErrorOfTheMean(entry.studentScores)
        )
      };
    });

    return rows;
  }

  private getExamSubgroupValue(exam: Exam, subgroupCode: string): any {
    switch (subgroupCode) {
      case 'Gender': return exam.student.genderCode;
      case 'Ethnicity': return exam.student.ethnicityCodes;
      case 'Section504': return exam.plan504;
      case 'IEP': return exam.iep;
      case 'MigrantStatus': return exam.migrantStatus;
      case 'StudentEnrolledGrade': return exam.enrolledGrade;
    }

    return null;
  }

  mapTargetScoreDeltaToReportingLevel(delta: number, standardError: number): TargetReportingLevel {
    // TODO: remove.  keeping for now to help test the display with a lot of mixed values
    // if (Math.random() > 0.7) return TargetReportingLevel.Above;
    // if (Math.random() > 0.35) return TargetReportingLevel.Near;
    // if (Math.random() > 0.1) return TargetReportingLevel.Below;
    // return TargetReportingLevel.InsufficientData;

    if (standardError > 0.2) return TargetReportingLevel.InsufficientData;
    if (delta >= standardError) return TargetReportingLevel.Above;
    if (delta <= -standardError) return TargetReportingLevel.Below;
    return TargetReportingLevel.Near;
  }
}
