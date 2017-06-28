import { ExamStatisticsCalculator } from "./exam-statistics-calculator";
import { Exam } from "../model/exam.model";
import { AssessmentItem } from "../model/assessment-item.model";
import { ExamItemScore } from "../model/exam-item-score.model";

describe('Exam Calculator', () => {

  it('should calculate the average', () => {
    let exams = [ 2580, 2551, 2850, 2985, 2650, 2651 ].map(x => {
      let exam = new Exam();
      exam.score = x;
      return exam;
    });

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.calculateAverage(exams);
    expect(actual).toBe(16267 / 6);
  });

  it('should calculate the average when there is only one score.', () => {
    let exams = [ 2393 ].map(x => {
      let exam = new Exam();
      exam.score = x;
      return exam;
    });

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.calculateAverage(exams);
    expect(actual).toBe(2393);
  });

  it('should add one level for the number of specified levels', () => {
    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.groupLevels([], 3);

    expect(actual[ 0 ].id).toBe(1);
    expect(actual[ 1 ].id).toBe(2);
    expect(actual[ 2 ].id).toBe(3);

    expect(actual[ 0 ].value).toBe(0);
    expect(actual[ 1 ].value).toBe(0);
    expect(actual[ 2 ].value).toBe(0);

    expect(actual[ 3 ]).toBeUndefined();
  });

  it('should count and group levels.', () => {
    let exams = [ 3, 3, 2, 3, 2, 1, 2, 3 ].map(x => {
      let exam = new Exam();
      exam.level = x;
      return exam;
    });

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.groupLevels(exams, 3);

    expect(actual[ 0 ].value).toBe(1);
    expect(actual[ 1 ].value).toBe(3);
    expect(actual[ 2 ].value).toBe(4);
  });

  it('should include levels not present in the exams', () => {
    let exams = [ 3, 3, 1, 3, 1, 1, 1, 3 ].map(x => {
      let exam = new Exam();
      exam.level = x;
      return exam;
    });

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.groupLevels(exams, 3);

    expect(actual[ 0 ].value).toBe(4);
    expect(actual[ 1 ].value).toBe(0);
    expect(actual[ 2 ].value).toBe(4);
  });

  it('should calculate level percents', () => {
    let exams = [ 3, 3, 2, 3, 2, 1, 1, 3, 3, 1 ].map(x => {
      let exam = new Exam();
      exam.level = x;
      return exam;
    });

    let fixture = new ExamStatisticsCalculator();
    let levels = fixture.groupLevels(exams, 3);

    let actual = fixture.calculateLevelPercents(levels, exams.length);

    expect(actual[ 0 ].value).toBe(30);
    expect(actual[ 1 ].value).toBe(20);
    expect(actual[ 2 ].value).toBe(50);
  });

  it('should calculate level percents when a level does not exist', () => {
    let exams = [ 3, 3, 1, 3, 1, 1, 1, 3 ].map(x => {
      let exam = new Exam();
      exam.level = x;
      return exam;
    });

    let fixture = new ExamStatisticsCalculator();
    let levels = fixture.groupLevels(exams, 3);

    let actual = fixture.calculateLevelPercents(levels, exams.length);

    expect(actual[ 0 ].value).toBe(50);
    expect(actual[ 1 ].value).toBe(0);
    expect(actual[ 2 ].value).toBe(50);
  });

  it('should aggregate items by points', () =>{
    let assessmentItems = [{
      maxPoints: 3,
      results: [ 2, 3, 1, 1, 3]
    }, {
      maxPoints: 1,
      results: [1, 0, 1, 1, 1]
    }].map(ai => {
     let item = new AssessmentItem();
     item.maxPoints = ai.maxPoints;
     item.scores = ai.results.map(result => {
       let score = new ExamItemScore();
       score.points = result;
       return score;
     });

     return item;
    });

    let fixture = new ExamStatisticsCalculator();
    fixture.aggregateItemsByPoints(assessmentItems);

    let actual = assessmentItems[0];

    expect(actual["number-point_0"]).toBe(0);
    expect(actual["number-point_1"]).toBe(2);
    expect(actual["number-point_2"]).toBe(1);
    expect(actual["number-point_3"]).toBe(2);

    expect(actual["percent-point_0"]).toBe(0);
    expect(actual["percent-point_1"]).toBe(40);
    expect(actual["percent-point_2"]).toBe(20);
    expect(actual["percent-point_3"]).toBe(40);

    actual = assessmentItems[1];

    expect(actual["number-point_0"]).toBe(1);
    expect(actual["number-point_1"]).toBe(4);
    expect(actual["number-point_2"]).toBeUndefined();
    expect(actual["number-point_3"]).toBeUndefined();

    expect(actual["percent-point_0"]).toBe(20);
    expect(actual["percent-point_1"]).toBe(80);
    expect(actual["percent-point_2"]).toBeUndefined();
    expect(actual["percent-point_3"]).toBeUndefined();
  });

  it('should return fields based on the max of max points', () => {
    let assessmentItems = [ 3, 1, 2, 4 ,2, 1, 2, 3 ].map(x =>{
      let item = new AssessmentItem();
      item.maxPoints = x;
      return item;
    });

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.getPointFields(assessmentItems);

    let onePlusMaxOfMaxPoints = 5;
    expect(actual.length).toBe(onePlusMaxOfMaxPoints);

    for(let i =0; i < actual.length; i++) {
      expect(actual[i].points).toBe(i);
      expect(actual[i].numberField).toBe("number-point_" + i);
      expect(actual[i].percentField).toBe("percent-point_" + i);
    }
  });
});
