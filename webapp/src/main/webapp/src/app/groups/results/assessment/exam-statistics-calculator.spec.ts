import { ExamStatisticsCalculator } from "./exam-statistics-calculator";
import { Exam } from "./model/exam.model";

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
});
