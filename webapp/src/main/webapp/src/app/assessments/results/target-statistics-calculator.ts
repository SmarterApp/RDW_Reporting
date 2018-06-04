import { Injectable } from '@angular/core';
import { SubgroupMapper } from '../../aggregate-report/subgroup/subgroup.mapper';
import { AggregateTargetScoreRow, TargetReportingLevel } from '../model/aggregate-target-score-row.model';
import { TargetScoreExam } from '../model/target-score-exam.model';
import { Exam } from '../model/exam.model';
import { ExamStatisticsCalculator } from './exam-statistics-calculator';
import { Target } from '../model/target.model';
import * as deepEqual from "fast-deep-equal";
import { ExamFilterOptions } from '../model/exam-filter-options.model';
import { Subgroup } from '../../aggregate-report/subgroup/subgroup';

@Injectable()
export class TargetStatisticsCalculator {
  constructor(private examStatisticsCalculator: ExamStatisticsCalculator,
              private subgroupMapper: SubgroupMapper) {
  }

  aggregateOverallScores(allTargets: Target[], targetScoreExams: TargetScoreExam[]): AggregateTargetScoreRow[] {
    // setup the placeholders to aggregate into
    let groupedScores = this.generateOverallTargets(allTargets);

    if (targetScoreExams == null) targetScoreExams = [];

    groupedScores = targetScoreExams.reduce((groupedExams, exam) => {
      let index = groupedExams.findIndex(x => x.targetId == exam.targetId);
      if (index !== -1) {
        groupedExams[ index ].standardMetScores.push(exam.standardMetRelativeResidualScore);
        groupedExams[ index ].studentScores.push(exam.studentRelativeResidualScore);
      }

      return groupedExams;
    }, groupedScores);

    return groupedScores.map(entry => this.mapToAggregateTargetScoreRow(entry));
  }

  aggregateSubgroupScores(allTargets: Target[], targetScoreExams: TargetScoreExam[], subgroupCode: string, subgroupOptions: ExamFilterOptions): AggregateTargetScoreRow[] {
    // setup the placeholders to aggregate into
    let groupedScores = this.generateSubgroupTargets(allTargets, subgroupCode, subgroupOptions);

    if (targetScoreExams == null) targetScoreExams = [];

    targetScoreExams.forEach(exam => {
      let value = this.getExamSubgroupValue(exam, subgroupCode);
      let subgroupValues = Array.isArray(value) ? value : [value];

      // always treat results as array since race/ethnicity will come back as array and we need to handle multiple as separate entries
      subgroupValues.forEach(examSubgroupValue => {
        let subgroup = this.subgroupMapper.fromTypeAndCode(subgroupCode, examSubgroupValue);

        let index = groupedScores.findIndex(x => x.targetId == exam.targetId && deepEqual(x.subgroup, subgroup));
        if (index !== -1) {
          groupedScores[ index ].standardMetScores.push(exam.standardMetRelativeResidualScore);
          groupedScores[ index ].studentScores.push(exam.studentRelativeResidualScore);
        }
      });
    });

    return groupedScores.map(entry => this.mapToAggregateTargetScoreRow(entry));
  }

  private mapToAggregateTargetScoreRow(groupedScore: GroupedTargetScore): AggregateTargetScoreRow {
    const numStudents = groupedScore.standardMetScores.length;
    return <AggregateTargetScoreRow>{
      targetId: groupedScore.targetId,
      claim: groupedScore.claim,
      target: groupedScore.target,
      subgroup: groupedScore.subgroup,
      studentsTested: numStudents,
      standardMetRelativeLevel: groupedScore.includeInReport
        ? this.getReportingLevel(groupedScore.standardMetScores)
        : TargetReportingLevel.Excluded,
      studentRelativeLevel: groupedScore.includeInReport
        ? this.getReportingLevel(groupedScore.studentScores)
        : TargetReportingLevel.Excluded,
    };
  }

  /**
   * Generates a row for each Target as the initial placeholders and determines if any are exlcuded
   * This means we won't have to backfill later as all targets are there already
   * @param {Target[]} allTargets
   * @returns {GroupedTargetScore[]} that is used in the other aggregate methods
   */
  private generateOverallTargets(allTargets: Target[]): GroupedTargetScore[] {
    const overallSubgroup = this.subgroupMapper.createOverall();
    return allTargets.map(target => <GroupedTargetScore>{
      targetId: target.id,
      target: target.code,
      claim: target.claimCode,
      subgroup: overallSubgroup,
      standardMetScores: [],
      studentScores: [],
      includeInReport: target.includeInReport
    });
  }

  private generateSubgroupTargets(allTargets: Target[], subgroupCode: string, subgroupOptions: ExamFilterOptions): GroupedTargetScore[] {
    let groupedScores: GroupedTargetScore[] = [];

    let subgroupValues = [];
    switch (subgroupCode) {
      case 'Gender':
        subgroupValues = subgroupOptions.genders;
        break;
      case 'Ethnicity':
        subgroupValues = subgroupOptions.ethnicities;
        break;
      case 'ELAS':
        subgroupValues = [...subgroupOptions.elasCodes, null]; // adding NULL since we have Not Stated data but not a filter option for it
        break;
      case 'Section504':
      case 'IEP':
        subgroupValues = [true, false];
        break;
      case 'MigrantStatus':
        subgroupValues = [true, false, undefined];
        break;
    }

    subgroupValues.forEach(subgroupValue => {
      let subgroup = this.subgroupMapper.fromTypeAndCode(subgroupCode, subgroupValue);

      groupedScores.push(
        ...allTargets.map(target => <GroupedTargetScore>{
          targetId: target.id,
          target: target.code,
          claim: target.claimCode,
          subgroup: subgroup,
          standardMetScores: [],
          studentScores: [],
          includeInReport: target.includeInReport
        })
      );
    });

    return groupedScores;
  }

  private getReportingLevel(scores: number[]) {
    if (scores.length === 0) return TargetReportingLevel.InsufficientData;

    return this.mapTargetScoreDeltaToReportingLevel(
      this.examStatisticsCalculator.calculateAverage(scores),
      this.examStatisticsCalculator.calculateStandardErrorOfTheMean(scores)
    );
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


  mapTargetScoreDeltaToReportingLevel(delta: number, standardError: number, insufficientCutpoint: number = 0.2): TargetReportingLevel {
    // TODO: remove.  keeping for now to help test the display with a lot of mixed values
    // if (Math.random() > 0.7) return TargetReportingLevel.Above;
    // if (Math.random() > 0.35) return TargetReportingLevel.Near;
    // if (Math.random() > 0.1) return TargetReportingLevel.Below;
    // return TargetReportingLevel.InsufficientData;

    if (standardError > insufficientCutpoint) return TargetReportingLevel.InsufficientData;
    if (delta >= standardError) return TargetReportingLevel.Above;
    if (delta <= -standardError) return TargetReportingLevel.Below;
    return TargetReportingLevel.Near;
  }
}

export interface GroupedTargetScore {
  targetId: number;
  target: string;
  claim: string;
  subgroup: Subgroup;
  standardMetScores: number[];
  studentScores: number[];
  includeInReport: boolean
}
