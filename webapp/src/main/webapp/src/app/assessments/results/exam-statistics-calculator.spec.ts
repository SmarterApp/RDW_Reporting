import { ExamStatisticsCalculator } from './exam-statistics-calculator';
import { Exam } from '../model/exam';
import { AssessmentItem } from '../model/assessment-item.model';
import { ExamItemScore } from '../model/exam-item-score.model';
import { ClaimStatistics } from '../model/exam-statistics.model';

describe('Exam Calculator', () => {
  it('should return only scored exams', () => {
    let exams: Exam[] = [1, null, 2, undefined, 0].map(score => {
      return <Exam>{ score };
    });

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.getOnlyScoredExams(exams);
    expect(actual.length).toBe(2);
  });

  it('should add one level for the number of specified levels', () => {
    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.groupLevels([], 3);

    expect(actual[0].id).toBe(1);
    expect(actual[1].id).toBe(2);
    expect(actual[2].id).toBe(3);

    expect(actual[0].value).toBe(0);
    expect(actual[1].value).toBe(0);
    expect(actual[2].value).toBe(0);

    expect(actual[3]).toBeUndefined();
  });

  it('should count and group levels.', () => {
    let exams: Exam[] = [3, 3, 2, 3, 2, 1, 2, 3].map(level => {
      return <Exam>{ level };
    });

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.groupLevels(exams, 3);

    expect(actual[0].value).toBe(1);
    expect(actual[1].value).toBe(3);
    expect(actual[2].value).toBe(4);
  });

  it('should include levels not present in the exams', () => {
    let exams: Exam[] = [3, 3, 1, 3, 1, 1, 1, 3].map(level => {
      return <Exam>{ level };
    });

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.groupLevels(exams, 3);

    expect(actual[0].value).toBe(4);
    expect(actual[1].value).toBe(0);
    expect(actual[2].value).toBe(4);
  });

  it('should include levels when there are no scored exams', () => {
    let exams: Exam[] = [];

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.groupLevels(exams, 3);

    expect(actual[0].value).toBe(0);
    expect(actual[1].value).toBe(0);
    expect(actual[2].value).toBe(0);
  });

  it('should include percent levels not present in the exams', () => {
    let exams: Exam[] = [3, 3, 1, 3, 1, 1, 1, 3].map(level => {
      return <Exam>{ level };
    });

    let fixture = new ExamStatisticsCalculator();
    let levels = fixture.groupLevels(exams, 3);
    let actual = fixture.mapGroupLevelsToPercents(levels);

    expect(actual[0].value).toBe(50.0);
    expect(actual[1].value).toBe(0);
    expect(actual[2].value).toBe(50.0);
  });

  it('should include percent levels when there are no scored exams', () => {
    let exams: Exam[] = [];

    let fixture = new ExamStatisticsCalculator();
    let levels = fixture.groupLevels(exams, 3);
    let actual = fixture.mapGroupLevelsToPercents(levels);

    expect(actual[0].value).toBe(0);
    expect(actual[1].value).toBe(0);
    expect(actual[2].value).toBe(0);
  });

  it('should aggregate writing trait scores', () => {
    let assessmentItems = [
      {
        maxPoints: 6,
        results: [4, 6, 2, 4, 4],
        traitScores: [[2, 3, 1], [4, 4, 2], [1, 3, 0], [3, 2, 1], [4, 0, 2]]
      }
    ].map(ai => {
      let item = new AssessmentItem();
      item.maxPoints = ai.maxPoints;
      item.scores = ai.results.map((result, i) => {
        let score = new ExamItemScore();
        score.points = result;
        score.writingTraitScores = {
          evidence: ai.traitScores[i][0],
          organization: ai.traitScores[i][1],
          conventions: ai.traitScores[i][2]
        };
        return score;
      });

      return item;
    });

    let fixture = new ExamStatisticsCalculator();
    let summaries = fixture.aggregateWritingTraitScores(assessmentItems);

    summaries.forEach(summaryMap => {
      const summary = summaryMap.values().next().value;
      expect(summary.evidence.average).toEqual(2.8);
      expect(summary.evidence.numbers).toEqual([0, 1, 1, 1, 2]);
      expect(summary.evidence.percents).toEqual([0, 20.0, 20.0, 20.0, 40.0]);

      expect(summary.organization.average).toEqual(2.4);
      expect(summary.organization.numbers).toEqual([1, 0, 1, 2, 1]);
      expect(summary.organization.percents).toEqual([
        20.0,
        0,
        20.0,
        40.0,
        20.0
      ]);

      expect(summary.conventions.average).toEqual(1.2);
      expect(summary.conventions.numbers).toEqual([1, 2, 2]);
      expect(summary.conventions.percents).toEqual([20.0, 40.0, 40.0]);

      expect(summary.total.average).toEqual(4.0);
      expect(summary.total.numbers).toEqual([0, 0, 1, 0, 3, 0, 1]);
      expect(summary.total.percents).toEqual([0, 0, 20.0, 0, 60.0, 0, 20.0]);
    });
  });

  it('should aggregate items by points', () => {
    let assessmentItems = [
      {
        maxPoints: 3,
        results: [2, 3, 1, 1, 3]
      },
      {
        maxPoints: 1,
        results: [1, 0, 1, 1, 1]
      }
    ].map(ai => {
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

    expect(actual['number-point_0']).toBe(0);
    expect(actual['number-point_1']).toBe(2);
    expect(actual['number-point_2']).toBe(1);
    expect(actual['number-point_3']).toBe(2);

    expect(actual['percent-point_0']).toBe(0);
    expect(actual['percent-point_1']).toBe(40);
    expect(actual['percent-point_2']).toBe(20);
    expect(actual['percent-point_3']).toBe(40);

    actual = assessmentItems[1];

    expect(actual['number-point_0']).toBe(1);
    expect(actual['number-point_1']).toBe(4);
    expect(actual['number-point_2']).toBeUndefined();
    expect(actual['number-point_3']).toBeUndefined();

    expect(actual['percent-point_0']).toBe(20);
    expect(actual['percent-point_1']).toBe(80);
    expect(actual['percent-point_2']).toBeUndefined();
    expect(actual['percent-point_3']).toBeUndefined();
  });

  it('should aggregate items by response', () => {
    let assessmentItems = [
      {
        numberOfChoices: 2,
        responses: ['B', 'A', 'A', 'A']
      },
      {
        numberOfChoices: 4,
        responses: ['D', 'D', 'A', 'A', 'A']
      }
    ].map(ai => {
      let item = new AssessmentItem();
      item.numberOfChoices = ai.numberOfChoices;
      item.scores = ai.responses.map(result => {
        let score = new ExamItemScore();
        score.points = 1;
        score.response = result;
        return score;
      });

      return item;
    });

    let fixture = new ExamStatisticsCalculator();
    fixture.aggregateItemsByResponse(assessmentItems);
    let actual = assessmentItems[0];

    expect(actual['number-point_A']).toBe(3);
    expect(actual['number-point_B']).toBe(1);
    expect(actual['number-point_C']).toBeUndefined();
    expect(actual['number-point_D']).toBeUndefined();

    expect(actual['percent-point_A']).toBe(75);
    expect(actual['percent-point_B']).toBe(25);
    expect(actual['percent-point_C']).toBeUndefined();
    expect(actual['percent-point_D']).toBeUndefined();

    actual = assessmentItems[1];

    expect(actual['number-point_A']).toBe(3);
    expect(actual['number-point_B']).toBe(0);
    expect(actual['number-point_C']).toBe(0);
    expect(actual['number-point_D']).toBe(2);

    expect(actual['percent-point_A']).toBe(60);
    expect(actual['percent-point_B']).toBe(0);
    expect(actual['percent-point_C']).toBe(0);
    expect(actual['percent-point_D']).toBe(40);
  });

  it('should return fields based on the max of max points', () => {
    let assessmentItems = [3, 1, 2, 4, 2, 1, 2, 3].map(x => {
      let item = new AssessmentItem();
      item.maxPoints = x;
      return item;
    });

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.getPointFields(assessmentItems);

    let onePlusMaxOfMaxPoints = 5;
    expect(actual.length).toBe(onePlusMaxOfMaxPoints);

    for (let i = 0; i < actual.length; i++) {
      expect(actual[i].label).toBe(i.toString());
      expect(actual[i].numberField).toBe('number-point_' + i);
      expect(actual[i].percentField).toBe('percent-point_' + i);
    }
  });

  it('should return fields based on the max of number of choices', () => {
    let assessmentItems = [3, 1, 2, 4, 2, 1, 2, 3].map(x => {
      let item = new AssessmentItem();
      item.numberOfChoices = x;
      return item;
    });

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.getChoiceFields(assessmentItems);

    let expectedLength = 4;
    expect(actual.length).toBe(expectedLength);

    let potentialResponses = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < actual.length; i++) {
      expect(actual[i].label).toBe(potentialResponses[i]);
      expect(actual[i].numberField).toBe(
        'number-point_' + potentialResponses[i]
      );
      expect(actual[i].percentField).toBe(
        'percent-point_' + potentialResponses[i]
      );
    }
  });

  it('should aggregate by claims and levels', () => {
    let exams = <Exam[]>[
      {
        claimScaleScores: [
          { level: 1 },
          { level: 2 },
          { level: 3 },
          { level: 1 }
        ]
      },
      {
        claimScaleScores: [
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
        id: 0,
        levels: [{ id: 1, value: 2 }, { id: 2, value: 0 }, { id: 3, value: 0 }],
        percents: [
          { id: 1, value: 100.0, suffix: '%' },
          { id: 2, value: 0, suffix: '%' },
          { id: 3, value: 0, suffix: '%' }
        ]
      },
      {
        id: 1,
        levels: [{ id: 1, value: 0 }, { id: 2, value: 2 }, { id: 3, value: 0 }],
        percents: [
          { id: 1, value: 0, suffix: '%' },
          { id: 2, value: 100.0, suffix: '%' },
          { id: 3, value: 0, suffix: '%' }
        ]
      },
      {
        id: 2,
        levels: [{ id: 1, value: 1 }, { id: 2, value: 0 }, { id: 3, value: 1 }],
        percents: [
          { id: 1, value: 50.0, suffix: '%' },
          { id: 2, value: 0, suffix: '%' },
          { id: 3, value: 50.0, suffix: '%' }
        ]
      },
      {
        id: 3,
        levels: [{ id: 1, value: 1 }, { id: 2, value: 1 }, { id: 3, value: 0 }],
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
        claimScaleScores: [{ level: 1 }, { level: 1 }, { level: 1 }]
      },
      {
        claimScaleScores: [{ level: 2 }, { level: 6 }, { level: -2 }]
      }
    ];

    let fixture = new ExamStatisticsCalculator();
    let actual = fixture.calculateClaimStatistics(exams, 3);

    expect(actual).toEqual(<ClaimStatistics[]>[
      {
        id: 0,
        levels: [{ id: 1, value: 1 }, { id: 2, value: 1 }, { id: 3, value: 0 }],
        percents: [
          { id: 1, value: 50.0, suffix: '%' },
          { id: 2, value: 50.0, suffix: '%' },
          { id: 3, value: 0, suffix: '%' }
        ]
      },
      {
        id: 1,
        levels: [{ id: 1, value: 1 }, { id: 2, value: 0 }, { id: 3, value: 0 }],
        percents: [
          { id: 1, value: 100.0, suffix: '%' },
          { id: 2, value: 0, suffix: '%' },
          { id: 3, value: 0, suffix: '%' }
        ]
      },
      {
        id: 2,
        levels: [{ id: 1, value: 1 }, { id: 2, value: 0 }, { id: 3, value: 0 }],
        percents: [
          { id: 1, value: 100.0, suffix: '%' },
          { id: 2, value: 0, suffix: '%' },
          { id: 3, value: 0, suffix: '%' }
        ]
      }
    ]);
  });
});
