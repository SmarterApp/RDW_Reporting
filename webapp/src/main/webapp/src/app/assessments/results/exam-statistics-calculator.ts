import { Injectable } from "@angular/core";
import { AssessmentItem } from "../model/assessment-item.model";

@Injectable()
export class ExamStatisticsCalculator {
  private readonly NumberFieldPrefix = "number-point_";
  private readonly PercentFieldPrefix = "percent-point_";

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

  aggregateItemsByPoints(assessmentItems: AssessmentItem[]) {
    for(let item of assessmentItems){
      for(let i=0; i <= item.maxPoints; i++){
        if(item.scores.length > 0 ){
          let count = item.scores.filter(x => x.points == i).length;
          item[this.NumberFieldPrefix + i] = count;
          item[this.PercentFieldPrefix + i] = count / item.scores.length * 100;
        }
        else {
          item[this.NumberFieldPrefix+ i] = 0;
          item[this.PercentFieldPrefix + i] = 0;
        }
      }
    }
  }

  getPointFields(assessmentItems: AssessmentItem[]){
    let max = assessmentItems.reduce((x, y) => x.maxPoints > y.maxPoints ? x : y).maxPoints;
    let pointFields = [];

    for (let i = 0; i <= max; i++) {
      pointFields[ i ] = {
        numberField: this.NumberFieldPrefix + i,
        percentField: this.PercentFieldPrefix + i,
        points: i
      };
    }

    return pointFields;
  }
}
