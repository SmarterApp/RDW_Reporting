import { ScoreDefinition } from '../../subject/subject';
import { ScaleScore } from './scale-score';
import { isNullOrEmpty } from '../../shared/support/support';
import * as math from 'mathjs';
import { isScored } from './scale-scores';

/**
 * Declares all the different score types
 */
export type ScoreType = 'Overall' | 'Alternate' | 'Claim';

/**
 * High level set of statistics computed from a set of exams for a specific assessment
 */
export interface ScoreStatistics {
  /**
   * The code or grouping ID
   * If absent it is meant to represent the overall score
   */
  code?: string;

  /**
   * The average scale score of the result group
   */
  averageScaleScore: number;

  /**
   * The standard error of the result group
   */
  standardErrorOfMean: number;

  /**
   * The exam count and percentages of exam scores that fall in a specific performance level
   */
  performanceLevelScores: PerformanceLevelScore[];
}

/**
 * Performance level data
 */
export interface PerformanceLevelScore {
  /**
   * The level the score is at
   */
  level: number;

  /**
   * The count of exams with scores of this performance level
   */
  count: number;

  /**
   * The percent of exams with scores of this performance level
   */
  percent: number;
}

/**
 * Calculates the sum of the provided numeric values
 * If a value is null or undefined NaN will be returned
 *
 * @param values The numbers to sum
 */
export function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

/**
 * Calculates the average of the provided numeric values
 * If a value is null or undefined NaN will be returned
 *
 * @param values The numbers to average
 */
export function average(values: number[]): number {
  return sum(values) / values.length;
}

/**
 * Calculates the percent of the count given the total number
 *
 * @param count The count to find the percent for
 * @param total The total number to divide by
 */
export function percent(count: number, total: number): number {
  return (count / total) * 100;
}

/**
 * Calculates the standard error of the mean for the given values
 * If a value is null or undefined an error will be thrown
 *
 * @param values The
 */
export function standardErrorOfMean(values: number[]): number {
  if (values.length == 0) {
    return 0;
  }
  return math.std(values) / Math.sqrt(values.length);
}

/**
 * Takes an array of percents and makes them integers that sum to 100 exactly
 * Used for percent distribution visualizations where the percentages need to sum to 100 or it will not make visual sense
 *
 * @param percents The percent values to round
 */
export function roundPercentages(percents: number[]): number[] {
  // make sure the percents are whole numbers
  const rounded = percents.map((value, index) => ({
    index,
    roundedPercent: Math.round(value),
    remainder: Math.round(value) - value
  }));

  const totalRoundedPercent = sum(
    rounded.map(({ roundedPercent }) => roundedPercent)
  );

  // if we don't naturally have 100% we need to adjust the percentages until we do
  if (totalRoundedPercent !== 100) {
    const adjustment = totalRoundedPercent > 100 ? -1 : 1;

    // to get the total to equal 100, this adds or subtracts 1 from items prioritized by how much rounding was done
    let currentPercent = totalRoundedPercent;
    rounded
      .slice()
      .sort((a, b) => (a.remainder - b.remainder) * adjustment)
      .forEach(({ index }) => {
        if (currentPercent !== 100) {
          // adjust rounded percent
          rounded[index].roundedPercent += adjustment;

          // correct total percent until it reaches 100
          currentPercent += adjustment;
        }
      });
  }

  return rounded.map(({ roundedPercent }) => roundedPercent);
}

/**
 * Calculates the performance level scores given the exam scale score levels and subject/assessment score levels
 *
 * @param examLevels The exams' scale score levels
 * @param scoreLevels The subject/assessment's performance levels
 */
export function performanceLevelScores(
  examLevels: number[],
  scoreLevels: number[]
): PerformanceLevelScore[] {
  // count how many exams fall in each level
  const scores: PerformanceLevelScore[] = scoreLevels.map(level => ({
    level,
    count: 0,
    percent: null
  }));

  examLevels.forEach(examLevel => {
    const score = scores.find(({ level }) => level === examLevel);
    score.count++;
  });

  const resultCount = examLevels.length;

  return scores.map(score => ({
    ...score,
    percent: resultCount === 0 ? 0 : percent(score.count, resultCount)
  }));
}

/**
 * Calculates the score statistics for a set of exams' scale scores
 *
 * @param examScaleScores The scale scores to calculate the statistics for
 * @param scoreDefinition The score definition used to lookup the score levels and codes
 */
export function scoreStatistics(
  examScaleScores: ScaleScore[][],
  scoreDefinition: ScoreDefinition
): ScoreStatistics[] {
  // should this validation be responsibility of the caller?
  const scoredExamScaleScores = examScaleScores.filter(
    scaleScores => !isNullOrEmpty(scaleScores) && scaleScores.every(isScored)
  );

  // group exam scale scores by code index
  const scaleScoresByCodeIndex: ScaleScore[][] = [];
  scoredExamScaleScores.forEach(scaleScores => {
    scaleScores.forEach((scaleScore, index) => {
      const codeScores = scaleScoresByCodeIndex[index];
      if (codeScores != null) {
        scaleScoresByCodeIndex[index].push(scaleScore);
      } else {
        scaleScoresByCodeIndex[index] = [scaleScore];
      }
    });
  });

  return (scoreDefinition.codes || [null]).map((code, index) => {
    const scaleScores = scaleScoresByCodeIndex[index] || [];
    const scores = scaleScores
      .map(({ score }) => score)
      .filter(value => value != null);
    return {
      code,
      averageScaleScore: average(scores),
      standardErrorOfMean: standardErrorOfMean(scores),
      performanceLevelScores: performanceLevelScores(
        scaleScores.map(({ level }) => level),
        scoreDefinition.levels
      )
    };
  });
}
