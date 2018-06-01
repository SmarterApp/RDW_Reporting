import { ExamStatisticsCalculator } from './exam-statistics-calculator';
import { Exam } from '../model/exam.model';
import { AssessmentItem } from '../model/assessment-item.model';
import { ExamItemScore } from '../model/exam-item-score.model';
import { ClaimStatistics } from '../model/claim-score.model';
import { TargetScoreExam } from '../model/target-score-exam.model';
import { TargetReportingLevel } from '../model/aggregate-target-score-row.model';

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
    let scores = [ 2580, 2551, 2850, 2985, 2650, 2651 ];

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.calculateAverage(scores);
    expect(actual).toBe(16267 / 6);
  });

  it('should calculate the average when there is only one score.', () => {
    let scores = [ 2393 ];

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.calculateAverage(scores);
    expect(actual).toBe(2393);
  });

  it('should calculate the average when there are unscored exams.', () => {
    let scores = [ 2580, 2551, 2850, 2985, 2650, 2651 ];

    let fixture = new ExamStatisticsCalculator();
    let expected = fixture.calculateAverage(scores);

    scores.push(null);
    let actual = fixture.calculateAverage(scores);
    expect(actual).toBe(expected);
  });

  it('should calculate the average when there no scored exams.', () => {
    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.calculateAverage([]);
    expect(actual).toBeNaN();
  });

  it('should calculate the average standard error when there no scored exams.', () => {
    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.calculateStandardErrorOfTheMean([]);
    expect(actual).toBe(0);
  });

  it('should calculate the average standard error of the mean correctly', () => {
    let scores = [ 2, 4, 6 ];

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.calculateStandardErrorOfTheMean(scores);
    expect(actual).toBe(2 / Math.sqrt(scores.length));
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

  it('should aggregate writing trait scores', () => {
    let assessmentItems = [ {
      maxPoints: 6,
      results: [ 4, 6, 2, 4, 4 ],
      traitScores: [
        [ 2, 3, 1 ],
        [ 4, 4, 2 ],
        [ 1, 3, 0 ],
        [ 3, 2, 1 ],
        [ 4, 0, 2 ]
      ]
    } ].map(ai => {
      let item = new AssessmentItem();
      item.maxPoints = ai.maxPoints;
      item.scores = ai.results.map((result, i) => {
        let score = new ExamItemScore();
        score.points = result;
        score.writingTraitScores = {
          evidence: ai.traitScores[ i ][ 0 ],
          organization: ai.traitScores[ i ][ 1 ],
          conventions: ai.traitScores[ i ][ 2 ]
        }
        return score;
      });

      return item;
    });

    let fixture = new ExamStatisticsCalculator();
    let summaries = fixture.aggregateWritingTraitScores(assessmentItems);

    summaries.forEach(summary => {
      expect(summary.evidence.average).toEqual(2.8);
      expect(summary.evidence.numbers).toEqual([ 0, 1, 1, 1, 2 ]);
      expect(summary.evidence.percents).toEqual([ 0, 20.0, 20.0, 20.0, 40.0 ]);

      expect(summary.organization.average).toEqual(2.4);
      expect(summary.organization.numbers).toEqual([ 1, 0, 1, 2, 1 ]);
      expect(summary.organization.percents).toEqual([ 20.0, 0, 20.0, 40.0, 20.0 ]);

      expect(summary.conventions.average).toEqual(1.2);
      expect(summary.conventions.numbers).toEqual([ 1, 2, 2 ]);
      expect(summary.conventions.percents).toEqual([ 20.0, 40.0, 40.0 ]);

      expect(summary.total.average).toEqual(4.0);
      expect(summary.total.numbers).toEqual([ 0, 0, 1, 0, 3, 0, 1 ]);
      expect(summary.total.percents).toEqual([ 0, 0, 20.0, 0, 60.0, 0, 20.0 ]);
    });
  });


  it('should aggregate items by points', () => {
    let assessmentItems = [ {
      maxPoints: 3,
      results: [ 2, 3, 1, 1, 3 ]
    }, {
      maxPoints: 1,
      results: [ 1, 0, 1, 1, 1 ]
    } ].map(ai => {
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

    let actual = assessmentItems[ 0 ];

    expect(actual[ "number-point_0" ]).toBe(0);
    expect(actual[ "number-point_1" ]).toBe(2);
    expect(actual[ "number-point_2" ]).toBe(1);
    expect(actual[ "number-point_3" ]).toBe(2);

    expect(actual[ "percent-point_0" ]).toBe(0);
    expect(actual[ "percent-point_1" ]).toBe(40);
    expect(actual[ "percent-point_2" ]).toBe(20);
    expect(actual[ "percent-point_3" ]).toBe(40);

    actual = assessmentItems[ 1 ];

    expect(actual[ "number-point_0" ]).toBe(1);
    expect(actual[ "number-point_1" ]).toBe(4);
    expect(actual[ "number-point_2" ]).toBeUndefined();
    expect(actual[ "number-point_3" ]).toBeUndefined();

    expect(actual[ "percent-point_0" ]).toBe(20);
    expect(actual[ "percent-point_1" ]).toBe(80);
    expect(actual[ "percent-point_2" ]).toBeUndefined();
    expect(actual[ "percent-point_3" ]).toBeUndefined();
  });

  it('should aggregate items by response', () => {
    let assessmentItems = [ {
      numberOfChoices: 2,
      responses: [ 'B', 'A', 'A', 'A' ]
    }, {
      numberOfChoices: 4,
      responses: [ 'D', 'D', 'A', 'A', 'A' ]
    } ].map(ai => {
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
    let actual = assessmentItems[ 0 ];

    expect(actual[ "number-point_A" ]).toBe(3);
    expect(actual[ "number-point_B" ]).toBe(1);
    expect(actual[ "number-point_C" ]).toBeUndefined()
    expect(actual[ "number-point_D" ]).toBeUndefined();

    expect(actual[ "percent-point_A" ]).toBe(75);
    expect(actual[ "percent-point_B" ]).toBe(25);
    expect(actual[ "percent-point_C" ]).toBeUndefined();
    expect(actual[ "percent-point_D" ]).toBeUndefined();

    actual = assessmentItems[ 1 ];

    expect(actual[ "number-point_A" ]).toBe(3);
    expect(actual[ "number-point_B" ]).toBe(0);
    expect(actual[ "number-point_C" ]).toBe(0)
    expect(actual[ "number-point_D" ]).toBe(2)

    expect(actual[ "percent-point_A" ]).toBe(60);
    expect(actual[ "percent-point_B" ]).toBe(0);
    expect(actual[ "percent-point_C" ]).toBe(0);
    expect(actual[ "percent-point_D" ]).toBe(40);
  });

  it('should return fields based on the max of max points', () => {
    let assessmentItems = [ 3, 1, 2, 4, 2, 1, 2, 3 ].map(x => {
      let item = new AssessmentItem();
      item.maxPoints = x;
      return item;
    });

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.getPointFields(assessmentItems);

    let onePlusMaxOfMaxPoints = 5;
    expect(actual.length).toBe(onePlusMaxOfMaxPoints);

    for (let i = 0; i < actual.length; i++) {
      expect(actual[ i ].label).toBe(i.toString());
      expect(actual[ i ].numberField).toBe("number-point_" + i);
      expect(actual[ i ].percentField).toBe("percent-point_" + i);
    }
  });

  it('should return fields based on the max of number of choices', () => {
    let assessmentItems = [ 3, 1, 2, 4, 2, 1, 2, 3 ].map(x => {
      let item = new AssessmentItem();
      item.numberOfChoices = x;
      return item;
    });

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.getChoiceFields(assessmentItems);

    let expectedLength = 4;
    expect(actual.length).toBe(expectedLength);

    let potentialResponses = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < actual.length; i++) {
      expect(actual[ i ].label).toBe(potentialResponses[ i ]);
      expect(actual[ i ].numberField).toBe("number-point_" + potentialResponses[ i ]);
      expect(actual[ i ].percentField).toBe("percent-point_" + potentialResponses[ i ]);
    }
  });

  it('should aggregate by claims and levels', () => {
    let exams = <Exam[]>[
      {
        claimScores: [
          { level: 1 },
          { level: 2 },
          { level: 3 },
          { level: 1 },
        ]
      },
      {
        claimScores: [
          { level: 1 },
          { level: 2 },
          { level: 1 },
          { level: 2 }
        ]
      }
    ];

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.calculateClaimStatistics(exams, 3);

    expect(actual).toEqual(<ClaimStatistics[]>[
      {
        id: 0, levels: [
          { id: 1, value: 2 },
          { id: 2, value: 0 },
          { id: 3, value: 0 }
        ],
        percents: [
          { id: 1, value: 100.0, suffix: '%' },
          { id: 2, value: 0, suffix: '%' },
          { id: 3, value: 0, suffix: '%' }
        ]
      },
      {
        id: 1, levels: [
          { id: 1, value: 0 },
          { id: 2, value: 2 },
          { id: 3, value: 0 }
        ],
        percents: [
          { id: 1, value: 0, suffix: '%' },
          { id: 2, value: 100.0, suffix: '%' },
          { id: 3, value: 0, suffix: '%' }
        ]
      },
      {
        id: 2, levels: [
          { id: 1, value: 1 },
          { id: 2, value: 0 },
          { id: 3, value: 1 }
        ],
        percents: [
          { id: 1, value: 50.0, suffix: '%' },
          { id: 2, value: 0, suffix: '%' },
          { id: 3, value: 50.0, suffix: '%' }
        ]
      },
      {
        id: 3, levels: [
          { id: 1, value: 1 },
          { id: 2, value: 1 },
          { id: 3, value: 0 }
        ],
        percents: [
          { id: 1, value: 50.0, suffix: '%' },
          { id: 2, value: 50.0, suffix: '%' },
          { id: 3, value: 0, suffix: '%' }
        ]
      }
    ]);
  });

  it('should aggregate by empty exams', () => {
    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.calculateClaimStatistics([], 3);

    expect(actual).toEqual([]);
  });

  it('should ignore bad claim levels when aggregating', () => {
    let exams = <Exam[]>[
      {
        claimScores: [
          { level: 1 },
          { level: 1 },
          { level: 1 },
        ]
      },
      {
        claimScores: [
          { level: 2 },
          { level: 6 },
          { level: -2 }
        ]
      }
    ];

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.calculateClaimStatistics(exams, 3);

    expect(actual).toEqual(<ClaimStatistics[]>[
      {
        id: 0, levels: [
          { id: 1, value: 1 },
          { id: 2, value: 1 },
          { id: 3, value: 0 }
        ],
        percents: [
          { id: 1, value: 50.0, suffix: '%' },
          { id: 2, value: 50.0, suffix: '%' },
          { id: 3, value: 0, suffix: '%' }
        ]
      },
      {
        id: 1, levels: [
          { id: 1, value: 1 },
          { id: 2, value: 0 },
          { id: 3, value: 0 }
        ],
        percents: [
          { id: 1, value: 100.0, suffix: '%' },
          { id: 2, value: 0, suffix: '%' },
          { id: 3, value: 0, suffix: '%' }
        ]
      },
      {
        id: 2, levels: [
          { id: 1, value: 1 },
          { id: 2, value: 0 },
          { id: 3, value: 0 }
        ],
        percents: [
          { id: 1, value: 100.0, suffix: '%' },
          { id: 2, value: 0, suffix: '%' },
          { id: 3, value: 0, suffix: '%' }
        ]
      }
    ]);
  });

  it('should determine data widths from simple percents', () => {
    let fixture = new ExamStatisticsCalculator();
    expect(fixture.getDataWidths([ 30.0, 70.0 ])).toEqual([ 30, 70 ]);
    expect(fixture.getDataWidths([ 33.0, 34.0, 33.0 ])).toEqual([ 33, 34, 33 ]);
    expect(fixture.getDataWidths([ 20.0, 30.0, 25.0, 25.0 ])).toEqual([ 20, 30, 25, 25 ]);
  });

  it('should determine data widths with rounding issues', () => {
    let fixture = new ExamStatisticsCalculator();
    expect(fixture.getDataWidths([ 30.5, 69.5 ])).toEqual([ 30, 70 ]);
    expect(fixture.getDataWidths([ 33.49, 32.49, 34.18 ])).toEqual([ 34, 32, 34 ]);
    expect(fixture.getDataWidths([ 40.5, 59.5, 0.0 ])).toEqual([ 40, 60, 0 ]);
    expect(fixture.getDataWidths([ 20.55, 30.2, 25.75, 24.5 ])).toEqual([ 20, 30, 26, 24 ]);
  });

  it ('should aggregate target scores', () => {
    let exams: TargetScoreExam[] = [
      <TargetScoreExam>{id: 1, targetId: 1, standardMetRelativeResidualScore: 0.15, studentRelativeResidualScore: 0.9},
      <TargetScoreExam>{id: 1, targetId: 2, standardMetRelativeResidualScore: 0.2, studentRelativeResidualScore: 0.15},
      <TargetScoreExam>{id: 1, targetId: 3, standardMetRelativeResidualScore: 0.1, studentRelativeResidualScore: 0.4},
      <TargetScoreExam>{id: 2, targetId: 1, standardMetRelativeResidualScore: 0.4, studentRelativeResidualScore: 0.2},
      <TargetScoreExam>{id: 2, targetId: 2, standardMetRelativeResidualScore: 0.6, studentRelativeResidualScore: 0.3},
      <TargetScoreExam>{id: 2, targetId: 3, standardMetRelativeResidualScore: 0.5, studentRelativeResidualScore: 0.2}
    ];

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.aggregateTargetScores(exams);

    expect(actual.length).toBe(3);

    expect(actual[ 0 ].targetId).toBe(1);
    expect(actual[ 0 ].standardMetRelativeLevel).toBe(TargetReportingLevel.Above);
    expect(actual[ 0 ].studentRelativeLevel).toBe(TargetReportingLevel.InsufficientData);

    expect(actual[ 1 ].targetId).toBe(2);
    expect(actual[ 1 ].standardMetRelativeLevel).toBe(TargetReportingLevel.Above);
    expect(actual[ 1 ].studentRelativeLevel).toBe(TargetReportingLevel.Above);

    expect(actual[ 2 ].targetId).toBe(3);
    expect(actual[ 2 ].standardMetRelativeLevel).toBe(TargetReportingLevel.Above);
    expect(actual[ 2 ].studentRelativeLevel).toBe(TargetReportingLevel.Above);
  });

  it('should map aggregaste target deltas to levels', () => {
    let fixture = new ExamStatisticsCalculator();

    expect(fixture.mapTargetScoreDeltaToReportingLevel(2, 1)).toBe(TargetReportingLevel.InsufficientData);
    expect(fixture.mapTargetScoreDeltaToReportingLevel(0.2, 0.1)).toBe(TargetReportingLevel.Above);
    expect(fixture.mapTargetScoreDeltaToReportingLevel(-0.2, 0.1)).toBe(TargetReportingLevel.Below);
    expect(fixture.mapTargetScoreDeltaToReportingLevel(0.05, 0.1)).toBe(TargetReportingLevel.Near);
  });
});
