import { Injectable } from '@angular/core';
import {
  AggregateTargetScoreRow,
  TargetReportingLevel
} from '../model/aggregate-target-score-row.model';
import { TargetScoreExam } from '../model/target-score-exam.model';
import { Exam } from '../model/exam';
import { ExamStatisticsCalculator } from './exam-statistics-calculator';
import { Target } from '../model/target.model';
import * as deepEqual from 'fast-deep-equal';
import { ExamFilterOptions } from '../model/exam-filter-options.model';
import {
  average,
  standardErrorOfMean
} from '../../exam/model/score-statistics';
import { Subgroup } from '../../shared/model/subgroup';
import {
  overallSubgroup,
  subgroupFromTypeAndCode
} from '../../shared/support/subgroups';
import { TranslateService } from '@ngx-translate/core';

export interface GroupedTargetScore {
  subject: string;
  targetId: number;
  target: string;
  targetNaturalId: string;
  claim: string;
  subgroup: Subgroup;
  standardMetScores: number[];
  studentScores: number[];
  includeInReport: boolean;
}

@Injectable()
export class TargetStatisticsCalculator {
  private _insufficientDataCutoff: number = 0.2;

  constructor(
    private examStatisticsCalculator: ExamStatisticsCalculator,
    private translateService: TranslateService
  ) {}

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
  aggregateOverallScores(
    subjectCode: string,
    allTargets: Target[],
    targetScoreExams: TargetScoreExam[]
  ): AggregateTargetScoreRow[] {
    targetScoreExams = targetScoreExams || [];

    // setup the placeholders to aggregate into
    const groupedScores = this.generateOverallTargets(subjectCode, allTargets);

    targetScoreExams.forEach(exam => {
      const scores = groupedScores.find(x => x.targetId == exam.targetId);
      if (scores != null) {
        scores.standardMetScores.push(exam.standardMetRelativeResidualScore);
        scores.studentScores.push(exam.studentRelativeResidualScore);
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
  aggregateSubgroupScores(
    subjectCode: string,
    allTargets: Target[],
    targetScoreExams: TargetScoreExam[],
    subgroupCodes: string[],
    subgroupOptions: ExamFilterOptions
  ): AggregateTargetScoreRow[] {
    targetScoreExams = targetScoreExams || [];

    // Special case for Languages, pull out just the used languageCodes for generatingSubgroupTargets
    const activeLanguageCodes = Array.from(
      new Set(targetScoreExams.map(e => e.languageCode))
    );

    // setup the placeholders to aggregate into
    const groupedScores = this.generateSubgroupTargets(
      subjectCode,
      allTargets,
      subgroupCodes,
      subgroupOptions,
      activeLanguageCodes
    );

    subgroupCodes.forEach(subgroupCode => {
      targetScoreExams.forEach(exam => {
        const value = this.getExamSubgroupValue(exam, subgroupCode);
        const subgroupValues = Array.isArray(value) ? value : [value];

        // always treat results as array since race/ethnicity will come back as array and we need to handle multiple as separate entries
        subgroupValues.forEach(examSubgroupValue => {
          const subgroup = subgroupFromTypeAndCode(
            subgroupCode,
            examSubgroupValue,
            this.translateService
          );
          const scores = groupedScores.find(
            x => x.targetId == exam.targetId && deepEqual(x.subgroup, subgroup)
          );
          if (scores != null) {
            scores.standardMetScores.push(
              exam.standardMetRelativeResidualScore
            );
            scores.studentScores.push(exam.studentRelativeResidualScore);
          }
        });
      });
    });
    return groupedScores.map(entry => this.mapToAggregateTargetScoreRow(entry));
  }

  private mapToAggregateTargetScoreRow(
    groupedScore: GroupedTargetScore
  ): AggregateTargetScoreRow {
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
        : TargetReportingLevel.Excluded
    };
  }

  /**
   * Generates a row for each Target as the initial placeholders and determines if any should be excluded
   * This means we won't have to backfill later as all targets are there already
   * @param {Target[]} allTargets
   * @returns {GroupedTargetScore[]} that is used in the other aggregate methods
   */
  private generateOverallTargets(
    subject: string,
    allTargets: Target[]
  ): GroupedTargetScore[] {
    return allTargets.map(
      target =>
        <GroupedTargetScore>{
          subject,
          targetId: target.id,
          targetNaturalId: target.naturalId,
          claim: target.claimCode,
          subgroup: overallSubgroup(this.translateService),
          standardMetScores: [],
          studentScores: [],
          includeInReport: target.includeInReport
        }
    );
  }

  /**
   * Generate a row for each Target and subgroup option as the initial placeholders and determines if any should be excluded
   * @param {Target[]} allTargets
   * @param {string[]} subgroupCodes
   * @param {ExamFilterOptions} subgroupOptions
   * @returns {GroupedTargetScore[]}
   */
  private generateSubgroupTargets(
    subjectCode: string,
    allTargets: Target[],
    subgroupCodes: string[],
    subgroupOptions: ExamFilterOptions,
    activeLanguageCodes: string[]
  ): GroupedTargetScore[] {
    const groupedScores: GroupedTargetScore[] = [];

    subgroupCodes.forEach(subgroupCode => {
      let subgroupValues = [];
      switch (subgroupCode) {
        case 'Gender':
          subgroupValues = subgroupOptions.genders;
          break;
        case 'Ethnicity':
          subgroupValues = subgroupOptions.ethnicities;
          break;
        case 'EnglishLanguageAcquisitionStatus':
          // adding NULL since we have Not Stated data but not a filter option for it
          subgroupValues = [...subgroupOptions.elasCodes, null];
          break;
        case 'EconomicDisadvantage':
        case 'LimitedEnglishProficiency':
        case 'Section504':
        case 'IndividualEducationPlan':
          subgroupValues = [true, false];
          break;
        case 'MigrantStatus':
          subgroupValues = [true, false, undefined];
          break;
        case 'PrimaryLanguage':
          subgroupValues = activeLanguageCodes;
          break;
        case 'MilitaryStudentIdentifier':
          subgroupValues = subgroupOptions.militaryConnectedCodes;
          break;
      }

      subgroupValues.forEach(subgroupValue => {
        const subgroup = subgroupFromTypeAndCode(
          subgroupCode,
          subgroupValue,
          this.translateService
        );

        groupedScores.push(
          ...allTargets.map(
            target =>
              <GroupedTargetScore>{
                subject: subjectCode,
                targetId: target.id,
                targetNaturalId: target.naturalId,
                claim: target.claimCode,
                subgroup,
                standardMetScores: [],
                studentScores: [],
                includeInReport: target.includeInReport
              }
          )
        );
      });
    });

    return groupedScores;
  }

  private getReportingLevel(scores: number[]) {
    if (scores.length === 0) {
      return TargetReportingLevel.NoResults;
    }

    const scored = scores.filter(value => value != null);

    return this.mapTargetScoreDeltaToReportingLevel(
      average(scored),
      standardErrorOfMean(scored)
    );
  }

  private getExamSubgroupValue(exam: Exam, subgroupCode: string): any {
    switch (subgroupCode) {
      case 'EconomicDisadvantage':
        return exam.economicDisadvantage;
      case 'Gender':
        return exam.student.genderCode;
      case 'Ethnicity':
        return exam.student.ethnicityCodes;
      case 'Section504':
        return exam.plan504;
      case 'LimitedEnglishProficiency':
        return exam.limitedEnglishProficiency;
      case 'IndividualEducationPlan':
        return exam.iep;
      case 'MigrantStatus':
        return exam.migrantStatus;
      case 'StudentEnrolledGrade':
        return exam.enrolledGrade;
      case 'PrimaryLanguage':
        return exam.languageCode;
      case 'MilitaryStudentIdentifier':
        return exam.militaryConnectedCode;

      // this is returned as undefined, but for subgrouping it needs to be null to match
      case 'EnglishLanguageAcquisitionStatus':
        return exam.elasCode! + null ? exam.elasCode : null;
    }

    return null;
  }

  /**
   * Calculate the reporting level based on the value and the standard error
   * @param {number} delta
   * @param {number} standardError
   * @returns {TargetReportingLevel}
   */
  mapTargetScoreDeltaToReportingLevel(
    delta: number,
    standardError: number
  ): TargetReportingLevel {
    if (standardError > this._insufficientDataCutoff)
      return TargetReportingLevel.InsufficientData;
    if (delta >= standardError) return TargetReportingLevel.Above;
    if (delta <= -standardError) return TargetReportingLevel.Below;
    return TargetReportingLevel.Near;
  }
}
