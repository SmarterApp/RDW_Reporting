import { Injectable } from "@angular/core";

@Injectable()
export class ExamStatisticsCalculator {

  calculateAverage(exams) {
    return exams.reduce((x, y) => x + y.score, 0) / exams.length;
  }

  groupLevels(exams, numberOfLevels) {
    let levels = [];

    for (let i = 0; i < numberOfLevels; i++) {
      let level = i + 1;
      levels[ i ] = { id: level, value: exams.filter(x => x.level == level).length };
    }

    return levels;
  }

  calculateLevelPercents(levels, total) {
    return levels.map(x => {
      return {
        id: x.id,
        value: x.value / total * 100,
        suffix: '%'
      }
    })
  };
}
