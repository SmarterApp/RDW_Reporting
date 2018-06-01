import { Injectable } from '@angular/core';
import { AssessmentItem } from '../model/assessment-item.model';
import { ExamStatisticsLevel } from '../model/exam-statistics.model';
import { Exam } from '../model/exam.model';
import { DynamicItemField } from '../model/item-point-field.model';
import * as math from 'mathjs';
import { WritingTraitScoreSummary } from '../model/writing-trait-score-summary.model';
import { ClaimStatistics } from '../model/claim-score.model';
import { TargetScoreExam } from '../model/target-score-exam.model';
import { AggregateTargetScoreRow, TargetReportingLevel } from '../model/aggregate-target-score-row.model';

@Injectable()
export class ExamStatisticsCalculator {
  private readonly NumberFieldPrefix = "number-point_";
  private readonly PercentFieldPrefix = "percent-point_";

  private readonly potentialResponses = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  calculateAverage(scores: number[]): number {
    let scored = scores.filter(x => x != null);
    return scored.reduce((x, y) => x + y, 0)
      / scored.length;
  }

  /**
   * Calculates the standard error of the mean
   *  = Standard Deviation / sqrt(N)  where N is the number of scores
   *
   * @param exams
   * @returns {number}
   */
  calculateStandardErrorOfTheMean(scores: number[]): number {
    let scored = scores.filter(x => x != null);

    if (scored.length == 0) {
      return 0;
    }

    return math.std(scored) / math.sqrt(scored.length);
  }

  calculateClaimStatistics(exams: Exam[], numberOfLevels: number): ClaimStatistics[] {
    let stats = [];

    if (exams == null || exams.length == 0 || exams[0].claimScores == null) return stats;

    for (let i = 0; i < exams[0].claimScores.length; i++) {
      let claimStats = <ClaimStatistics>{
        id: i,
        levels: this.groupLevels(exams.map(ex => ex.claimScores[i]), numberOfLevels)
      };

      claimStats.percents = this.mapGroupLevelsToPercents(claimStats.levels);
      stats.push(claimStats);
    }

    return stats;
  }

  getOnlyScoredExams(exams: Exam[]): Exam[] {
    return exams.filter(x => x && x.score);
  }

  groupLevels(exams, numberOfLevels: number): ExamStatisticsLevel[] {
    let levels = [];

    for (let i = 0; i < numberOfLevels; i++) {
      let level = i + 1;
      levels[ i ] = { id: level, value: exams.filter(x => x.level == level).length };
    }

    return levels;
  }

  mapGroupLevelsToPercents(levels: ExamStatisticsLevel[]): ExamStatisticsLevel[] {
    let total = levels.reduce((x, y) => x + y.value, 0);
    return levels.map(x => {
      return {
        id: x.id,
        value: total == 0 ? 0 : x.value / total * 100,
        suffix: '%'
      }
    });
  }

  aggregateItemsByPoints(assessmentItems: AssessmentItem[]) {
    for (let item of assessmentItems) {
      for (let i = 0; i <= item.maxPoints; i++) {
        if (item.scores.length > 0) {
          let count = item.scores.filter(x => x.points == i).length;
          item[ this.NumberFieldPrefix + i ] = count;
          item[ this.PercentFieldPrefix + i ] = count / item.scores.length * 100;
        }
        else {
          item[ this.NumberFieldPrefix + i ] = 0;
          item[ this.PercentFieldPrefix + i ] = 0;
        }
      }
    }
  }

  getPointFields(assessmentItems: AssessmentItem[]): DynamicItemField[] {
    let max = assessmentItems.reduce((x, y) => x.maxPoints > y.maxPoints ? x : y).maxPoints;
    let pointFields: DynamicItemField[] = [];

    for (let i = 0; i <= max; i++) {
      let column: DynamicItemField = new DynamicItemField();
      column.numberField = this.NumberFieldPrefix + i;
      column.percentField = this.PercentFieldPrefix + i;
      column.label = i.toString();
      pointFields.push(column);
    }

    return pointFields;
  }

  aggregateTargetScores(targetScoreExams: TargetScoreExam[]): AggregateTargetScoreRow[] {
    if (targetScoreExams == null) return [];

    let grouped = targetScoreExams.reduce((groupedExams, exam) => {
      let index = groupedExams.findIndex(x => x.targetId == exam.targetId);
      if (index === -1) {
        groupedExams.push({
          targetId: exam.targetId,
          standardMetScores:[],
          studentScores: []
        });

        index = groupedExams.length - 1;
      }

      groupedExams[ index ].standardMetScores.push(exam.standardMetRelativeResidualScore);
      groupedExams[ index ].studentScores.push(exam.studentRelativeResidualScore);

      return groupedExams;
    }, []);

    let rows = grouped.map(entry => {
      return <AggregateTargetScoreRow>{
        targetId: entry.targetId,
        studentsTested: entry.standardMetScores.length,
        standardMetRelativeLevel: this.mapTargetScoreDeltaToReportingLevel(
          this.calculateAverage(entry.standardMetScores),
          this.calculateStandardErrorOfTheMean(entry.standardMetScores)
        ),
        studentRelativeLevel: this.mapTargetScoreDeltaToReportingLevel(
          this.calculateAverage(entry.studentScores),
          this.calculateStandardErrorOfTheMean(entry.studentScores)
        )
      };
    });

    return rows;
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

  aggregateWritingTraitScores(assessmentItems: AssessmentItem[]): WritingTraitScoreSummary[] {
    let summaries: WritingTraitScoreSummary[] = [];

    assessmentItems.forEach(assessmentItem => {
      let summary = new WritingTraitScoreSummary();
      let itemsWithTraitScores = assessmentItem.scores.filter(x => x.writingTraitScores != null);
      let totalAnswers = itemsWithTraitScores.length;

      itemsWithTraitScores.forEach((score, index) => {
        summary.evidence.numbers[ score.writingTraitScores.evidence ]++;
        summary.organization.numbers[ score.writingTraitScores.organization ]++;
        summary.conventions.numbers[ score.writingTraitScores.conventions ]++;
        summary.total.numbers[ score.points ]++;
      });

      // calculate the averages and the percents based on the raw numbers
      summary.rows.forEach((aggregate, points) => {
        let total = 0;
        let count = 0;

        aggregate.numbers.forEach((num, index) => {
          total += num * index;
          count += num;

          aggregate.percents[ index ] = totalAnswers == 0 ? 0 : num / totalAnswers * 100;
        });

        aggregate.average = count == 0 ? 0 : total / count;
      });

      summaries.push(summary);
    });

    return summaries;
  }

  aggregateItemsByResponse(assessmentItems: AssessmentItem[]) {
    for (let item of assessmentItems) {
      this.assertNumberOfChoicesIsValid(item.numberOfChoices);

      for (let i = 0; i < item.numberOfChoices; i++) {
        let response = this.potentialResponses[ i ];

        if (item.scores.length > 0) {
          let compareFunction = item.type == 'MS'
            ? (x => x.response != null && x.response.indexOf(response) !== -1)
            : (x => x.response == response);

          let count = item.scores.filter(compareFunction).length;
          item[ this.NumberFieldPrefix + response ] = count;
          item[ this.PercentFieldPrefix + response ] = count / item.scores.length * 100;
        }
        else {
          item[ this.NumberFieldPrefix + response ] = 0;
          item[ this.PercentFieldPrefix + response ] = 0;
        }
      }
    }
  }

  getChoiceFields(assessmentItems: AssessmentItem[]): DynamicItemField[] {
    let maxNumberOfChoices = assessmentItems.reduce((x, y) => x.numberOfChoices > y.numberOfChoices ? x : y).numberOfChoices;
    this.assertNumberOfChoicesIsValid(maxNumberOfChoices);

    let pointFields: DynamicItemField[] = [];
    for (let i = 0; i < maxNumberOfChoices; i++) {
      let response = this.potentialResponses[ i ];

      let column: DynamicItemField = new DynamicItemField();
      column.numberField = this.NumberFieldPrefix + response;
      column.percentField = this.PercentFieldPrefix + response;
      column.label = response;
      pointFields.push(column);
    }

    return pointFields;
  }

  assertNumberOfChoicesIsValid(numberOfChoices: number) {
    // Assert we have a defined potential response for the given number of choices.
    if (numberOfChoices >= this.potentialResponses.length) {
      throw Error("Undefined potential response for given number of choices.");
    }
  }

  /**
   * Takes an array of percents and makes them integers that sum to 100 exactly
   * Used for data widths where it needs to be exact and not 99 or 101 due to rounding
   * @param {number[]} percents
   * @returns {number[]}
   */
  getDataWidths(percents: number[]): number[] {
    // make sure the percents are whole numbers
    let dataWidths = percents.map((x, index) => {
      return { index: index, percent: Math.round(x), diff: Math.round(x) - x };
    });
    let total = dataWidths.map(x => x.percent).reduce((x, y) => x + y);

    if (total == 100) return dataWidths.map(x => x.percent);

    let diff = total > 100 ? -1 : 1;

    // to get the total to equal 100, this adds or subtracts 1 from items prioritized by how much rounding was done
    dataWidths.concat().sort((a, b) => (a.diff - b.diff) * diff ).forEach((x, index) => {
      if (total != 100) {
        dataWidths[x.index].percent += diff;
        total += diff;
      }
    });

    return dataWidths.map(x => x.percent);
  }
}
