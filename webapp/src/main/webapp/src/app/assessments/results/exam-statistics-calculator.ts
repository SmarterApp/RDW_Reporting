import { Injectable } from "@angular/core";
import { AssessmentItem } from "../model/assessment-item.model";
import { ExamStatisticsLevel } from "../model/exam-statistics.model";
import { Exam } from "../model/exam.model";
import { ItemPointField } from "../model/item-point-field.model";

@Injectable()
export class ExamStatisticsCalculator {
  private readonly NumberFieldPrefix = "number-point_";
  private readonly PercentFieldPrefix = "percent-point_";

  calculateAverage(exams: Exam[]) {
    let scoredExams = this.getOnlyScoredExams(exams);
    return scoredExams.reduce((x, y) => x + y.score, 0)
      / scoredExams.length;
  }

  calculateAverageStandardError(exams: Exam[]) {
    let scoredExams = this.getOnlyScoredExams(exams);

    return Math.sqrt(
      scoredExams.reduce((x, y) => x + (y.standardError * y.standardError), 0)
      / scoredExams.length
    );
  }

  getOnlyScoredExams(exams: Exam[]): Exam[] {
    return exams.filter(x => x && x.score);
  }

  groupLevels(exams, numberOfLevels): ExamStatisticsLevel[] {
    let levels = [];

    for (let i = 0; i < numberOfLevels; i++) {
      let level = i + 1;
      levels[ i ] = { id: level, value: exams.filter(x => x.level == level).length };
    }

    return levels;
  }

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

  getPointFields(assessmentItems: AssessmentItem[]): ItemPointField[] {
    let max = assessmentItems.reduce((x, y) => x.maxPoints > y.maxPoints ? x : y).maxPoints;
    let pointFields: ItemPointField[] = [];

    for (let i = 0; i <= max; i++) {
      let column: ItemPointField = new ItemPointField();
      column.numberField = this.NumberFieldPrefix + i;
      column.percentField = this.PercentFieldPrefix + i;
      column.points = i;
      pointFields.push(column);
    }

    return pointFields;
  }
}
