import { ExamStatisticsCalculator } from "./exam-statistics-calculator";
import { Exam } from "../model/exam.model";
import { AssessmentItem } from "../model/assessment-item.model";
import { ExamItemScore } from "../model/exam-item-score.model";

describe('Exam Calculator', () => {

  it('should return only scored exams', () => {
    let exams = [ 1, null, 2, undefined, 0 ].map(x => {
      let exam = new Exam();
      exam.score = x;
      return exam;
    });

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.getOnlyScoredExams(exams);
    expect(actual.length).toBe(2);
  });

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

  it('should calculate the average when there are unscored exams.', () => {
    let exams = [ 2580, 2551, 2850, 2985, 2650, 2651 ].map(x => {
      let exam = new Exam();
      exam.score = x;
      return exam;
    });


    let fixture = new ExamStatisticsCalculator();
    let expected = fixture.calculateAverage(exams);

    exams.push(null);
    let actual = fixture.calculateAverage(exams);
    expect(actual).toBe(expected);
  });

  it('should calculate the average when there no scored exams.', () => {
    let exams: Exam[] = [];

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.calculateAverage(exams);
    expect(actual).toBeNaN();
  });

  it('should calculate the average standard error when there no scored exams.', () => {
    let exams: Exam[] = [];

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.calculateStandardErrorOfTheMean(exams);
    expect(actual).toBe(0);
  });

  it('should calculate the average standard error of the mean correctly', () => {
    let exams = [ 2, 4, 6 ].map(x => {
      let exam = new Exam();
      exam.score = x;
      return exam;
    });

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.calculateStandardErrorOfTheMean(exams);
    expect(actual).toBe(2/Math.sqrt(exams.length));
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

  it('should include levels when there are no scored exams', () => {
    let exams: Exam[] = [];

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.groupLevels(exams, 3);

    expect(actual[ 0 ].value).toBe(0);
    expect(actual[ 1 ].value).toBe(0);
    expect(actual[ 2 ].value).toBe(0);
  });

  it('should include percent levels not present in the exams', () => {
    let exams = [ 3, 3, 1, 3, 1, 1, 1, 3 ].map(x => {
      let exam = new Exam();
      exam.level = x;
      return exam;
    });

    let fixture = new ExamStatisticsCalculator();
    let levels = fixture.groupLevels(exams, 3);
    let actual = fixture.mapGroupLevelsToPercents(levels);

    expect(actual[ 0 ].value).toBe(50.0);
    expect(actual[ 1 ].value).toBe(0);
    expect(actual[ 2 ].value).toBe(50.0);
  });

  it('should include percent levels when there are no scored exams', () => {
    let exams: Exam[] = [];

    let fixture = new ExamStatisticsCalculator();
    let levels = fixture.groupLevels(exams, 3);
    let actual = fixture.mapGroupLevelsToPercents(levels);

    expect(actual[ 0 ].value).toBe(0);
    expect(actual[ 1 ].value).toBe(0);
    expect(actual[ 2 ].value).toBe(0);
  });

  it('should aggregate writing trait scores', () =>{
    let assessmentItems = [{
      maxPoints: 6,
      results: [ 4, 6, 2, 4, 4],
      traitScores: [
        [ 2, 3, 1],
        [ 4, 4, 2],
        [ 1, 3, 0],
        [ 3, 2, 1],
        [ 4, 0, 2]
      ]
    }].map(ai => {
      let item = new AssessmentItem();
      item.maxPoints = ai.maxPoints;
      item.scores = ai.results.map((result, i) => {
        let score = new ExamItemScore();
        score.points = result;
        score.writingTraitScores = {
          evidence: ai.traitScores[i][0],
          organization: ai.traitScores[i][1],
          conventions: ai.traitScores[i][2]
        }
        return score;
      });

      return item;
    });

    let fixture = new ExamStatisticsCalculator();
    let summary = fixture.aggregateWritingTraitScores(assessmentItems);

    expect(summary.evidence.average).toBe(2.8);
    expect(summary.evidence.numbers[0]).toBe(0);
    expect(summary.evidence.percents[0]).toBe(0);
    expect(summary.evidence.numbers[1]).toBe(1);
    expect(summary.evidence.percents[1]).toBe(20.0);
    expect(summary.evidence.numbers[2]).toBe(1);
    expect(summary.evidence.percents[2]).toBe(20.0);
    expect(summary.evidence.numbers[3]).toBe(1);
    expect(summary.evidence.percents[3]).toBe(20.0);
    expect(summary.evidence.numbers[4]).toBe(2);
    expect(summary.evidence.percents[4]).toBe(40.0);

    expect(summary.organization.average).toBe(2.4);
    expect(summary.organization.numbers[0]).toBe(1);
    expect(summary.organization.percents[0]).toBe(20.0);
    expect(summary.organization.numbers[1]).toBe(0);
    expect(summary.organization.percents[1]).toBe(0);
    expect(summary.organization.numbers[2]).toBe(1);
    expect(summary.organization.percents[2]).toBe(20.0);
    expect(summary.organization.numbers[3]).toBe(2);
    expect(summary.organization.percents[3]).toBe(40.0);
    expect(summary.organization.numbers[4]).toBe(1);
    expect(summary.organization.percents[4]).toBe(20.0);

    expect(summary.conventions.average).toBe(1.2);
    expect(summary.conventions.numbers[0]).toBe(1);
    expect(summary.conventions.percents[0]).toBe(20.0);
    expect(summary.conventions.numbers[1]).toBe(2);
    expect(summary.conventions.percents[1]).toBe(40.0);
    expect(summary.conventions.numbers[2]).toBe(2);
    expect(summary.conventions.percents[2]).toBe(40.0);

    expect(summary.total.average).toBe(4.0);
    expect(summary.total.numbers[0]).toBe(0);
    expect(summary.total.percents[0]).toBe(0);
    expect(summary.total.numbers[1]).toBe(0);
    expect(summary.total.percents[1]).toBe(0);
    expect(summary.total.numbers[2]).toBe(1);
    expect(summary.total.percents[2]).toBe(20.0);
    expect(summary.total.numbers[3]).toBe(0);
    expect(summary.total.percents[3]).toBe(0);
    expect(summary.total.numbers[4]).toBe(3);
    expect(summary.total.percents[4]).toBe(60.0);
    expect(summary.total.numbers[5]).toBe(0);
    expect(summary.total.percents[5]).toBe(0);
    expect(summary.total.numbers[6]).toBe(1);
    expect(summary.total.percents[6]).toBe(20.0);
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

  it('should aggregate items by response', () =>{
    let assessmentItems = [{
      numberOfChoices: 2,
      responses: [ 'B', 'A', 'A', 'A']
    }, {
      numberOfChoices: 4,
      responses: ['D', 'D', 'A', 'A', 'A']
    }].map(ai => {
     let item = new AssessmentItem();
     item.numberOfChoices = ai.numberOfChoices;
     item.scores = ai.responses.map(result => {
       let score = new ExamItemScore();
       score.response = result;
       return score;
     });

     return item;
    });

    let fixture = new ExamStatisticsCalculator();
    fixture.aggregateItemsByResponse(assessmentItems);
    let actual = assessmentItems[0];

    expect(actual["number-point_A"]).toBe(3);
    expect(actual["number-point_B"]).toBe(1);
    expect(actual["number-point_C"]).toBeUndefined()
    expect(actual["number-point_D"]).toBeUndefined();

    expect(actual["percent-point_A"]).toBe(75);
    expect(actual["percent-point_B"]).toBe(25);
    expect(actual["percent-point_C"]).toBeUndefined();
    expect(actual["percent-point_D"]).toBeUndefined();

    actual = assessmentItems[1];

    expect(actual["number-point_A"]).toBe(3);
    expect(actual["number-point_B"]).toBe(0);
    expect(actual["number-point_C"]).toBe(0)
    expect(actual["number-point_D"]).toBe(2)

    expect(actual["percent-point_A"]).toBe(60);
    expect(actual["percent-point_B"]).toBe(0);
    expect(actual["percent-point_C"]).toBe(0);
    expect(actual["percent-point_D"]).toBe(40);
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
      expect(actual[i].label).toBe(i.toString());
      expect(actual[i].numberField).toBe("number-point_" + i);
      expect(actual[i].percentField).toBe("percent-point_" + i);
    }
  });

  it('should return fields based on the max of number of choices', () => {
    let assessmentItems = [ 3, 1, 2, 4 ,2, 1, 2, 3 ].map(x =>{
      let item = new AssessmentItem();
      item.numberOfChoices = x;
      return item;
    });

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.getChoiceFields(assessmentItems);

    let expectedLength = 4;
    expect(actual.length).toBe(expectedLength);

    let potentialResponses = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for(let i =0; i < actual.length; i++) {
      expect(actual[i].label).toBe(potentialResponses[i]);
      expect(actual[i].numberField).toBe("number-point_" + potentialResponses[i]);
      expect(actual[i].percentField).toBe("percent-point_" + potentialResponses[i]);
    }
  });
});
