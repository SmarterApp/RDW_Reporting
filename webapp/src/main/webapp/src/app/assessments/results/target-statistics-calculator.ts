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
  private _insufficientDataCutoff: number = 0.2;

  constructor(private examStatisticsCalculator: ExamStatisticsCalculator,
              private subgroupMapper: SubgroupMapper) {
  }

  /**
   * Set the standard error cutoff used when determining if the data is sufficient or not
   * @param {number} cutoff
   */
  set insufficientDataCutoff(cutoff: number) {
    this._insufficientDataCutoff = cutoff;
  }

  /**
   * Calculate the overall scores for each target from the raw API data
   * @param {Target[]} allTargets
   * @param {TargetScoreExam[]} targetScoreExams
   * @returns {AggregateTargetScoreRow[]}
   */
  aggregateOverallScores(subjectCode: string, allTargets: Target[], targetScoreExams: TargetScoreExam[]): AggregateTargetScoreRow[] {
    // setup the placeholders to aggregate into
    let groupedScores = this.generateOverallTargets(subjectCode, allTargets);

    if (targetScoreExams == null) targetScoreExams = [];

    targetScoreExams.forEach(exam => {
      let index = groupedScores.findIndex(x => x.targetId == exam.targetId);
      if (index !== -1) {
        groupedScores[ index ].standardMetScores.push(exam.standardMetRelativeResidualScore);
        groupedScores[ index ].studentScores.push(exam.studentRelativeResidualScore);
      }
    });

    return groupedScores.map(entry => this.mapToAggregateTargetScoreRow(entry));
  }

  /**
   * Calculate the subgroup scores for each subgroup value and target
   * @param {Target[]} allTargets
   * @param {TargetScoreExam[]} targetScoreExams
   * @param {string[]} subgroupCodes
   * @param {ExamFilterOptions} subgroupOptions
   * @returns {AggregateTargetScoreRow[]}
   */
  aggregateSubgroupScores(subjectCode: string, allTargets: Target[], targetScoreExams: TargetScoreExam[], subgroupCodes: string[], subgroupOptions: ExamFilterOptions): AggregateTargetScoreRow[] {
    // setup the placeholders to aggregate into
    let groupedScores = this.generateSubgroupTargets(subjectCode, allTargets, subgroupCodes, subgroupOptions);

    if (targetScoreExams == null) targetScoreExams = [];

    subgroupCodes.forEach(subgroupCode => {
      targetScoreExams.forEach(exam => {
        let value = this.getExamSubgroupValue(exam, subgroupCode);
        let subgroupValues = Array.isArray(value) ? value : [ value ];

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
    });
    return groupedScores.filter( groupedScore => {  // filter out when the language results were 0 or we'll get a list of every language every time
      if(! ((groupedScore.standardMetScores.length == 0) && (groupedScore.subgroup.dimensionGroups[0].type === "Language"))) {
        return groupedScore;
      }
    }).map(entry => this.mapToAggregateTargetScoreRow(entry));
  }

  private mapToAggregateTargetScoreRow(groupedScore: GroupedTargetScore): AggregateTargetScoreRow {
    const numStudents = groupedScore.standardMetScores.length;
    return <AggregateTargetScoreRow>{
      targetId: groupedScore.targetId,
      claim: groupedScore.claim,
      targetNaturalId: groupedScore.targetNaturalId,
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
   * Generates a row for each Target as the initial placeholders and determines if any should be excluded
   * This means we won't have to backfill later as all targets are there already
   * @param {Target[]} allTargets
   * @returns {GroupedTargetScore[]} that is used in the other aggregate methods
   */
  private generateOverallTargets(subjectCode: string, allTargets: Target[]): GroupedTargetScore[] {
    const overallSubgroup = this.subgroupMapper.createOverall();
    return allTargets.map(target => <GroupedTargetScore>{
      subject: subjectCode,
      targetId: target.id,
      targetNaturalId: target.naturalId,
      claim: target.claimCode,
      subgroup: overallSubgroup,
      standardMetScores: [],
      studentScores: [],
      includeInReport: target.includeInReport
    });
  }

  /**
   * Generate a row for each Target and subgroup option as the initial placeholders and determines if any should be excluded
   * @param {Target[]} allTargets
   * @param {string[]} subgroupCodes
   * @param {ExamFilterOptions} subgroupOptions
   * @returns {GroupedTargetScore[]}
   */
  private generateSubgroupTargets(subjectCode: string, allTargets: Target[], subgroupCodes: string[], subgroupOptions: ExamFilterOptions): GroupedTargetScore[] {
    let groupedScores: GroupedTargetScore[] = [];

    subgroupCodes.forEach(subgroupCode => {
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
        case 'LEP':
        case 'Section504':
        case 'IEP':
          subgroupValues = [true, false];
          break;
        case 'MigrantStatus':
          subgroupValues = [true, false, undefined];
        case 'Language':
          subgroupValues = subgroupOptions.languages;
          break;
      }

      subgroupValues.forEach(subgroupValue => {
        let subgroup = this.subgroupMapper.fromTypeAndCode(subgroupCode, subgroupValue);

        groupedScores.push(
          ...allTargets.map(target => <GroupedTargetScore>{
            subject: subjectCode,
            targetId: target.id,
            targetNaturalId: target.naturalId,
            claim: target.claimCode,
            subgroup: subgroup,
            standardMetScores: [],
            studentScores: [],
            includeInReport: target.includeInReport
          })
        );
      });
    });

    return groupedScores;
  }

  private getReportingLevel(scores: number[]) {
    if (scores.length === 0) return TargetReportingLevel.NoResults;

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
      case 'LEP': return exam.limitedEnglishProficiency;
      case 'IEP': return exam.iep;
      case 'MigrantStatus': return exam.migrantStatus;
      case 'StudentEnrolledGrade': return exam.enrolledGrade;

      // if languageCode is undefined (for now) that means it was eng / English
      case 'Language': return exam.languageCode != undefined ? exam.languageCode : 'eng';

      // this is returned as undefined, but for subgrouping it needs to be null to match
      case 'ELAS': return exam.elasCode !+ null ? exam.elasCode : null;
    }

    return null;
  }

  /**
   * Calculate the reporting level based on the value and the standard error
   * @param {number} delta
   * @param {number} standardError
   * @param {number} insufficientCutpoint
   * @returns {TargetReportingLevel}
   */
  mapTargetScoreDeltaToReportingLevel(delta: number, standardError: number): TargetReportingLevel {
    if (standardError > this._insufficientDataCutoff) return TargetReportingLevel.InsufficientData;
    if (delta >= standardError) return TargetReportingLevel.Above;
    if (delta <= -standardError) return TargetReportingLevel.Below;
    return TargetReportingLevel.Near;
  }
}

export interface GroupedTargetScore {
  subject: string;
  targetId: number;
  target: string;
  targetNaturalId: string;
  claim: string;
  subgroup: Subgroup;
  standardMetScores: number[];
  studentScores: number[];
  includeInReport: boolean
}
