import { toScoreTable } from './score-tables';
import { Exam } from '../../../assessments/model/exam';
import { SubjectDefinition } from '../../../subject/subject';
import { ScoreTable } from './score-table';

describe('toScoreTable', () => {
  it('should create table for overall score', () => {
    const scoreType = 'Overall';

    const exams = [
      <Exam>{
        level: 1,
        score: 2,
        standardError: 3
      }
    ];

    const subjectDefinition = <SubjectDefinition>{
      subject: 'subject',
      assessmentType: 'assessmentType',
      overallScore: {
        levels: [1],
        levelCount: 1,
        standardCutoff: 1
      }
    };

    const actual = toScoreTable(exams, subjectDefinition, scoreType);

    const expected: ScoreTable = {
      scoreType,
      subjectCode: subjectDefinition.subject,
      assessmentTypeCode: subjectDefinition.assessmentType,
      resultCount: exams.length,
      scoreStatistics: [
        {
          code: null,
          averageScaleScore: 2,
          standardErrorOfMean: 0,
          performanceLevelScores: [
            {
              level: 1,
              count: 1,
              percent: 100,
              nameCode: 'subject.subject.asmt-type.assessmentType.level.1.name',
              colorCode:
                'subject.subject.asmt-type.assessmentType.level.1.color'
            }
          ]
        }
      ]
    };

    expect(actual).toEqual(expected);
  });

  it('should create table for alternate scores', () => {
    const scoreType = 'Alternate';

    const exams = [
      <Exam>{
        alternateScaleScores: [
          {
            level: 1,
            score: 2,
            standardError: 3
          }
        ]
      }
    ];

    const subjectDefinition = <SubjectDefinition>{
      subject: 'subject',
      assessmentType: 'assessmentType',
      alternateScore: {
        codes: ['a'],
        levels: [1],
        levelCount: 1
      }
    };

    const actual = toScoreTable(exams, subjectDefinition, scoreType);

    const expected: ScoreTable = {
      scoreType,
      subjectCode: subjectDefinition.subject,
      assessmentTypeCode: subjectDefinition.assessmentType,
      resultCount: exams.length,
      scoreStatistics: [
        {
          code: subjectDefinition.alternateScore.codes[0],
          averageScaleScore: 2,
          standardErrorOfMean: 0,
          performanceLevelScores: [
            {
              level: 1,
              count: 1,
              percent: 100,
              nameCode:
                'subject.subject.asmt-type.assessmentType.alt-score.level.1.name',
              colorCode:
                'subject.subject.asmt-type.assessmentType.alt-score.level.1.color'
            }
          ]
        }
      ]
    };

    expect(actual).toEqual(expected);
  });

  it('should create table for claim scores with different data and display orders and no score values', () => {
    const scoreType = 'Claim';

    const exams = [
      <Exam>{
        claimScaleScores: [
          {
            level: 1
          },
          {
            level: 1
          }
        ]
      }
    ];

    const subjectDefinition = <SubjectDefinition>{
      subject: 'subject',
      assessmentType: 'assessmentType',
      claimScore: {
        codes: ['a', 'b'],
        levels: [1],
        levelCount: 1
      }
    };

    const actual = toScoreTable(exams, subjectDefinition, scoreType, [
      'b',
      'a'
    ]);

    const expected: ScoreTable = {
      scoreType,
      subjectCode: subjectDefinition.subject,
      assessmentTypeCode: subjectDefinition.assessmentType,
      resultCount: exams.length,
      scoreStatistics: [
        {
          code: subjectDefinition.claimScore.codes[0],
          averageScaleScore: NaN,
          standardErrorOfMean: 0,
          performanceLevelScores: [
            {
              level: 1,
              count: 1,
              percent: 100,
              nameCode:
                'subject.subject.asmt-type.assessmentType.claim-score.level.1.name',
              colorCode:
                'subject.subject.asmt-type.assessmentType.claim-score.level.1.color'
            }
          ]
        },
        {
          code: subjectDefinition.claimScore.codes[1],
          averageScaleScore: NaN,
          standardErrorOfMean: 0,
          performanceLevelScores: [
            {
              level: 1,
              count: 1,
              percent: 100,
              nameCode:
                'subject.subject.asmt-type.assessmentType.claim-score.level.1.name',
              colorCode:
                'subject.subject.asmt-type.assessmentType.claim-score.level.1.color'
            }
          ]
        }
      ]
    };

    expect(actual).toEqual(expected);
  });
});
