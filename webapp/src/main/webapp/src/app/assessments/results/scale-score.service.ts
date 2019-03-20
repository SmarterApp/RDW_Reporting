import { Injectable } from '@angular/core';
import { ExamStatisticsLevel } from '../model/exam-statistics.model';

@Injectable()
export class ScaleScoreService {
  private minBarSize: number = 10;

  /**
   * Calculates the percent breakdown for the score distribution visualization
   * There is a minimum display width of 10%, therefore if the percent is less than 10, we need to adjust the others proportionally
   * so that the total percents sum to 100 exactly.
   *
   * @param originalPercents The actual percent breakdown across the levels
   * @returns {number[]} the percent level breakdown for the bar visualizations
   */
  public calculateDisplayScoreDistribution(
    originalPercents: ExamStatisticsLevel[]
  ): number[] {
    let percents = originalPercents.map(x => x.value);

    // determine how much over we are based on having a minimum bar size
    let minAdjustment = percents
      .filter(x => x <= this.minBarSize)
      .reduce((x, y) => x + this.minBarSize - y, 0);

    // what is the total for the levels that are above the min, used to calc new breakdown in proper proportion
    let totalAboveMin = percents
      .filter(x => x > this.minBarSize)
      .reduce((x, y) => x + y, 0);

    // calculate the new breakdown
    //  if the real percent is less than the min then use the min
    //  otherwise find the new value by using the current ratio
    let adjustedPercents = percents.map((x, i) => {
      let a: any = {
        index: i,
        original: x,
        updated:
          x > this.minBarSize
            ? (x * (totalAboveMin - minAdjustment)) / totalAboveMin
            : this.minBarSize
      };

      // instead of rounding, take the whole number and use the decimal part to determine how to distribute the amount over or under
      a.rounded = Math.floor(a.updated);
      a.remainder = a.updated - a.rounded;
      return a;
    });

    // the total needs to be 100 exactly for the visualization to work, see how far above or below we are
    let deltaToWhole =
      100 - adjustedPercents.reduce((x, y) => x + y.rounded, 0);

    // order by the remainder so that we can adjust them in order
    adjustedPercents.sort((a, b) => (a.remainder < b.remainder ? 1 : -1));

    // are we adding or subtracting to get to a total of 100
    let increment = deltaToWhole < 0 ? -1 : 1;

    // adjust one at a time either adding or subtracting to get to 100
    for (let i = 0; i < deltaToWhole * increment; i++) {
      adjustedPercents[i % adjustedPercents.length].rounded += increment;
    }

    // resort them based on the index so they are in the proper order for display
    adjustedPercents.sort((a, b) => (a.index < b.index ? -1 : 1));

    return adjustedPercents.map(x =>
      x.original < this.minBarSize ? Math.round(x.original) : x.rounded
    );
  }
}
