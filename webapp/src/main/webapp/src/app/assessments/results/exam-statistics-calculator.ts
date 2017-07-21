import { Injectable } from "@angular/core";
import { AssessmentItem } from "../model/assessment-item.model";
import { ExamStatisticsLevel } from "../model/exam-statistics.model";
import {Exam} from "../model/exam.model";

@Injectable()
export class ExamStatisticsCalculator {
  private readonly NumberFieldPrefix = "number-point_";
  private readonly PercentFieldPrefix = "percent-point_";

  calculateAverage(exams: Exam[]) {
    return this.getOnlyScoredExams(exams).reduce((x, y) => x + y.score, 0)
      / exams.length;
  }

  calculateAverageStandardError(exams: Exam[]) {
    let scoredExams = this.getOnlyScoredExams(exams);

    return Math.sqrt(
      scoredExams.reduce((x, y) => x + (y.standardError * y.standardError), 0)
      / scoredExams.length
    );
  }

  private getOnlyScoredExams(exams: Exam[]): Exam[] {
    return exams.filter(x => x.score != null);
  }

  groupLevels(exams, numberOfLevels): ExamStatisticsLevel[] {
    let levels = [];
    let scoredExams = this.getOnlyScoredExams(exams);

    for (let i = 0; i < numberOfLevels; i++) {
      let level = i + 1;
      levels[ i ] = { id: level, value: scoredExams.filter(x => x.level == level).length };
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

  getPointFields(assessmentItems: AssessmentItem[]) {
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
