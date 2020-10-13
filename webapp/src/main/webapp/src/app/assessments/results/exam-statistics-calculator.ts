import { Injectable } from '@angular/core';
import { AssessmentItem } from '../model/assessment-item.model';
import {
  ExamStatisticsLevel,
  ClaimStatistics
} from '../model/exam-statistics.model';
import { Exam } from '../model/exam';
import { DynamicItemField } from '../model/item-point-field.model';
import { TraitScoreSummary } from '../model/trait-score-summary.model';
import { ExamItemScore } from '../model/exam-item-score.model';
import { TraitCategoryAggregate } from '../model/trait-category-aggregate.model';
import { TraitCategoryInfo } from '../model/trait-category-info.model';

import { flatten } from 'lodash';
import { sum } from '../../exam/model/score-statistics';

@Injectable()
export class ExamStatisticsCalculator {
  private readonly NumberFieldPrefix = 'number-point_';
  private readonly PercentFieldPrefix = 'percent-point_';

  private readonly potentialResponses = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  calculateClaimStatistics(
    exams: Exam[],
    numberOfLevels: number
  ): ClaimStatistics[] {
    const stats = [];

    if (
      exams == null ||
      exams.length === 0 ||
      exams[0].claimScaleScores == null
    ) {
      return stats;
    }

    for (let i = 0; i < exams[0].claimScaleScores.length; i++) {
      const claimStats = <ClaimStatistics>{
        id: i,
        levels: this.groupLevels(
          exams.map(ex => ex.claimScaleScores[i]),
          numberOfLevels
        )
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
    const levels = [];

    for (let i = 0; i < numberOfLevels; i++) {
      const level = i + 1;
      levels[i] = {
        id: level,
        value: exams.filter(x => x.level === level).length
      };
    }

    return levels;
  }

  mapGroupLevelsToPercents(
    levels: ExamStatisticsLevel[]
  ): ExamStatisticsLevel[] {
    const total = levels.reduce((x, y) => x + y.value, 0);
    return levels.map(x => {
      return {
        id: x.id,
        value: total === 0 ? 0 : (x.value / total) * 100,
        suffix: '%'
      };
    });
  }

  aggregateItemsByPoints(assessmentItems: AssessmentItem[]) {
    for (const item of assessmentItems) {
      const scoreCount: number = item.scores.reduce(
        (count, score) => (score.points >= 0 ? count + 1 : count),
        0
      );
      for (let i = 0; i <= item.maxPoints; i++) {
        if (item.scores.length > 0) {
          const count = item.scores.filter(x => x.points === i).length;
          item[this.NumberFieldPrefix + i] = count;
          item[this.PercentFieldPrefix + i] =
            scoreCount > 0 ? (count / scoreCount) * 100 : 0;
        } else {
          item[this.NumberFieldPrefix + i] = 0;
          item[this.PercentFieldPrefix + i] = 0;
        }
      }
    }
  }

  getPointFields(assessmentItems: AssessmentItem[]): DynamicItemField[] {
    const max = assessmentItems.reduce((x, y) =>
      x.maxPoints > y.maxPoints ? x : y
    ).maxPoints;
    const pointFields: DynamicItemField[] = [];

    for (let i = 0; i <= max; i++) {
      const column: DynamicItemField = new DynamicItemField();
      column.numberField = this.NumberFieldPrefix + i;
      column.percentField = this.PercentFieldPrefix + i;
      column.label = i.toString();
      pointFields.push(column);
    }

    return pointFields;
  }

  /**
   * This method extracts exam-level trait scores and accumulates them into
   * TraitScoreSummary's. Although a single exam will have a single purpose, it
   * is possible that exams will have different purposes. The return is a map
   * of purpose -> TraitScoreSummary. It is in an array for compatibility reasons.
   *
   * This method is used for summatives which have exam-level trait scores
   * (and do not have item-level scores).
   *
   * @param exams exams with exam-level trait scores
   */
  aggregateExamTraitScores(exams: Exam[]) {
    const summaryMap = new Map();
    // accumulate numbers from exam trait scores
    flatten(
      exams
        .filter(exam => exam.traitScores != null && exam.traitScores.length > 0)
        .map(exam => exam.traitScores)
    ).forEach(ts => {
      if (!summaryMap.has(ts.purpose)) {
        summaryMap.set(ts.purpose, new TraitScoreSummary());
      }
      const traitScoreSummary = summaryMap.get(ts.purpose);
      if (!traitScoreSummary.aggregators.has(ts.category)) {
        traitScoreSummary.aggregators.set(
          ts.category,
          new TraitCategoryAggregate(
            new TraitCategoryInfo(ts.category, ts.maxScore)
          )
        );
      }
      traitScoreSummary.aggregators.get(ts.category).numbers[ts.score]++;
    });

    // calculate the rest of the fields in the aggregates
    summaryMap.forEach((value: TraitScoreSummary) => {
      value.rows.forEach(aggregate => {
        this.populateTraitCategoryAggregateValues(aggregate);
      });
    });

    return [summaryMap];
  }

  /**
   * This method accepts an array of assessment items but is typically invoked
   * with just a single item (since assessments typically have a single WER item).
   * For each item, it accumulates the trait scores by points scored, creating a
   * TraitScoreSummary for that item.
   *
   * This method is used for interims which have item-level detail and do not have
   * exam-level trait scores. "Writing" in the name indicates this deals with the
   * legacy WER items specific to SmarterBalanced ELA assessments.
   *
   * @param assessmentItems items to roll up, typically a single item
   */
  aggregateWritingTraitScores(assessmentItems: AssessmentItem[]) {
    const summaryMaps = [];

    assessmentItems.forEach(assessmentItem => {
      const purpose = assessmentItem.performanceTaskWritingType;

      const summary = TraitScoreSummary.InterimTraitScoreSummary();
      assessmentItem.scores
        .filter(score => score.points >= 0 && score.writingTraitScores != null)
        .forEach(score => {
          summary.evidence.numbers[score.writingTraitScores.evidence]++;
          summary.organization.numbers[score.writingTraitScores.organization]++;
          summary.conventions.numbers[score.writingTraitScores.conventions]++;
          summary.total.numbers[score.points]++;
        });

      // calculate the averages and the percents based on the raw numbers
      summary.rows.forEach(aggregate =>
        this.populateTraitCategoryAggregateValues(aggregate)
      );

      summaryMaps.push(new Map([[purpose, summary]]));
    });

    return summaryMaps;
  }

  populateTraitCategoryAggregateValues(aggregate: TraitCategoryAggregate) {
    const count = sum(aggregate.numbers);
    let total = 0;

    aggregate.numbers.forEach((num, index) => {
      total += num * index;
      aggregate.percents[index] = count === 0 ? 0 : (num / count) * 100;
    });

    aggregate.average = count === 0 ? 0 : total / count;
  }

  aggregateItemsByResponse(assessmentItems: AssessmentItem[]) {
    for (const item of assessmentItems) {
      this.assertNumberOfChoicesIsValid(item.numberOfChoices);

      // Only include "scored" item scores
      const itemScores: ExamItemScore[] = item.scores.filter(
        score => score.points >= 0
      );

      for (let i = 0; i < item.numberOfChoices; i++) {
        const response = this.potentialResponses[i];

        if (itemScores.length > 0) {
          const compareFunction =
            item.type === 'MS'
              ? x => x.response != null && x.response.indexOf(response) !== -1
              : x => x.response === response;

          const count = itemScores.filter(compareFunction).length;

          item[this.NumberFieldPrefix + response] = count;
          item[this.PercentFieldPrefix + response] =
            (count / itemScores.length) * 100;
        } else {
          item[this.NumberFieldPrefix + response] = 0;
          item[this.PercentFieldPrefix + response] = 0;
        }
      }
    }
  }

  getChoiceFields(assessmentItems: AssessmentItem[]): DynamicItemField[] {
    const maxNumberOfChoices = assessmentItems.reduce((x, y) =>
      x.numberOfChoices > y.numberOfChoices ? x : y
    ).numberOfChoices;
    this.assertNumberOfChoicesIsValid(maxNumberOfChoices);

    const pointFields: DynamicItemField[] = [];
    for (let i = 0; i < maxNumberOfChoices; i++) {
      const response = this.potentialResponses[i];

      const column: DynamicItemField = new DynamicItemField();
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
      throw Error('Undefined potential response for given number of choices.');
    }
  }
}
