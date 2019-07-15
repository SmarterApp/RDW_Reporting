import { ExamStatisticsCalculator } from './exam-statistics-calculator';
import { TargetScoreExam } from '../model/target-score-exam.model';
import { TargetReportingLevel } from '../model/aggregate-target-score-row.model';
import { TargetStatisticsCalculator } from './target-statistics-calculator';
import { Target } from '../model/target.model';

describe('Target Calculator', () => {
  let mockTranslateService = jasmine.createSpyObj('TranslateService', [
    'instant'
  ]);
  let fixture = new TargetStatisticsCalculator(
    new ExamStatisticsCalculator(),
    mockTranslateService
  );
  let allTargets = [
    <Target>{
      id: 1,
      assessmentId: 2,
      claimCode: '1-LT',
      naturalId: '1',
      includeInReport: true
    },
    {
      id: 2,
      assessmentId: 2,
      claimCode: '1-LT',
      naturalId: '2',
      includeInReport: true
    },
    {
      id: 3,
      assessmentId: 2,
      claimCode: '1-IT',
      naturalId: '3',
      includeInReport: false
    },
    {
      id: 4,
      assessmentId: 2,
      claimCode: '1-IT',
      naturalId: '4',
      includeInReport: true
    }
  ];

  it('should handle null for aggregate target calculation', () => {
    expect(fixture.aggregateOverallScores('ELA', [], null)).toEqual([]);
  });

  it('should aggregate target scores handling exclusions', () => {
    let exams: TargetScoreExam[] = [
      <TargetScoreExam>{
        id: 1,
        targetId: 1,
        standardMetRelativeResidualScore: 0.15,
        studentRelativeResidualScore: 0.9
      },
      <TargetScoreExam>{
        id: 1,
        targetId: 2,
        standardMetRelativeResidualScore: 0.2,
        studentRelativeResidualScore: 0.15
      },
      <TargetScoreExam>{
        id: 1,
        targetId: 4,
        standardMetRelativeResidualScore: 0.1,
        studentRelativeResidualScore: 0.4
      },
      <TargetScoreExam>{
        id: 2,
        targetId: 1,
        standardMetRelativeResidualScore: 0.4,
        studentRelativeResidualScore: 0.2
      },
      <TargetScoreExam>{
        id: 2,
        targetId: 2
        // include one with no target scores
      },
      <TargetScoreExam>{
        id: 2,
        targetId: 4,
        standardMetRelativeResidualScore: 0.5,
        studentRelativeResidualScore: 0.2
      }
    ];

    let actual = fixture.aggregateOverallScores('Math', allTargets, exams);

    expect(actual.length).toBe(4);

    expect(actual[0].targetId).toBe(1);
    expect(actual[0].studentsTested).toBe(2);
    expect(actual[0].standardMetRelativeLevel).toBe(TargetReportingLevel.Above);
    expect(actual[0].studentRelativeLevel).toBe(
      TargetReportingLevel.InsufficientData
    );

    expect(actual[1].targetId).toBe(2);
    expect(actual[1].studentsTested).toBe(2);
    expect(actual[1].standardMetRelativeLevel).toBe(TargetReportingLevel.Above);
    expect(actual[1].studentRelativeLevel).toBe(TargetReportingLevel.Above);

    expect(actual[2].targetId).toBe(3);
    expect(actual[2].studentsTested).toBe(0);
    expect(actual[2].standardMetRelativeLevel).toBe(
      TargetReportingLevel.Excluded
    );
    expect(actual[2].studentRelativeLevel).toBe(TargetReportingLevel.Excluded);

    expect(actual[3].targetId).toBe(4);
    expect(actual[3].studentsTested).toBe(2);
    expect(actual[3].standardMetRelativeLevel).toBe(TargetReportingLevel.Above);
    expect(actual[3].studentRelativeLevel).toBe(TargetReportingLevel.Above);
  });

  it('should map aggregate target deltas to levels', () => {
    expect(fixture.mapTargetScoreDeltaToReportingLevel(2, 1)).toBe(
      TargetReportingLevel.InsufficientData
    );
    expect(fixture.mapTargetScoreDeltaToReportingLevel(0.2, 0.1)).toBe(
      TargetReportingLevel.Above
    );
    expect(fixture.mapTargetScoreDeltaToReportingLevel(-0.2, 0.1)).toBe(
      TargetReportingLevel.Below
    );
    expect(fixture.mapTargetScoreDeltaToReportingLevel(0.05, 0.1)).toBe(
      TargetReportingLevel.Near
    );
  });
});
