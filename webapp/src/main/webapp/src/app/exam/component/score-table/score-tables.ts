import { ScoreDefinition, SubjectDefinition } from '../../../subject/subject';
import {
  roundPercentages,
  scoreStatistics,
  ScoreType
} from '../../model/score-statistics';
import { Exam } from '../../../assessments/model/exam';
import { ScaleScore } from '../../model/scale-score';
import { ScoreTable } from './score-table';
import { isNullOrEmpty } from '../../../shared/support/support';

/**
 * Metadata associated with score types used to assemble data from exams around certain score types
 */
interface ScoreTypeMetadata {
  /**
   * Gets the score definition for the score type from the subject definition
   * TODO should we just store in the score definitions in a map already?
   *
   * @param subjectDefinition The subject/assessment configuration to get the score configuration from
   */
  scoreDefinition(subjectDefinition: SubjectDefinition): ScoreDefinition;

  /**
   * Gets the scale scores from an exam corresponding to the score type
   *
   * @param exam The exam to get the scale scores from
   */
  scaleScores(exam: Exam): ScaleScore[];

  /**
   * Composes a name translation code for the given performance level, subject and assessment type code
   *
   * @param level The performance level
   * @param subjectCode The subject identifier
   * @param assessmentTypeCode The assessment type identifier
   */
  performanceLevelName(
    level: number,
    subjectCode: string,
    assessmentTypeCode: string
  ): string;

  /**
   * Composes a color translation code for the given performance level, subject and assessment type code
   *
   * @param level The performance level
   * @param subjectCode The subject identifier
   * @param assessmentTypeCode The assessment type identifier
   */
  performanceLevelColor(
    level: number,
    subjectCode: string,
    assessmentTypeCode: string
  ): string;
}

const ScoreTypeMetadataByType: Map<string, ScoreTypeMetadata> = new Map<
  string,
  ScoreTypeMetadata
>([
  [
    // TODO cut over to use this to aggregate overall score data
    // TODO fill in when cutting over
    'Overall',
    {
      scoreDefinition: ({ overallScore }) => <any>overallScore,
      scaleScores: exam => [exam],
      performanceLevelName: (level, subject, assessmentType) => ``,
      performanceLevelColor: (level, subject, assessmentType) => ``
    }
  ],
  [
    'Alternate',
    {
      scoreDefinition: ({ alternateScore }) => alternateScore,
      scaleScores: ({ alternateScaleScores }) => alternateScaleScores,
      performanceLevelName: (level, subject, assessmentType) =>
        `subject.${subject}.asmt-type.${assessmentType}.alt-score.level.${level}.name`,
      performanceLevelColor: (level, subject, assessmentType) =>
        `subject.${subject}.asmt-type.${assessmentType}.alt-score.level.${level}.color`
    }
  ],
  [
    // TODO cut over to use this for claim score aggregation
    'Claim',
    {
      scoreDefinition: ({ claimScore }) => claimScore,
      scaleScores: ({ claimScaleScores }) => claimScaleScores,
      performanceLevelName: (level, subject, assessmentType) =>
        `subject.${subject}.asmt-type.${assessmentType}.claim-score.level.${level}.name`,
      performanceLevelColor: (level, subject, assessmentType) =>
        `subject.${subject}.asmt-type.${assessmentType}.claim-score.level.${level}.color`
    }
  ]
]);

/**
 * Creates a score table model for the given exams, subject/assessment configuration and score type
 *
 * @param exams The exams to get the scores from
 * @param subjectDefinition The subject/assessment configuration of the exams
 * @param scoreType The score type to create the table for
 */
export function toScoreTable(
  exams: Exam[],
  subjectDefinition: SubjectDefinition,
  scoreType: ScoreType
): ScoreTable {
  const {
    subject: subjectCode,
    assessmentType: assessmentTypeCode
  } = subjectDefinition;
  const metadata = ScoreTypeMetadataByType.get(scoreType);

  const examScaleScores = exams
    .map(exam => metadata.scaleScores(exam))
    .filter(
      scaleScores =>
        !isNullOrEmpty(scaleScores) &&
        scaleScores.every(
          scaleScore =>
            scaleScore != null &&
            scaleScore.level != null &&
            scaleScore.score != null &&
            scaleScore.standardError != null
        )
    );

  const statistics = scoreStatistics(
    examScaleScores,
    metadata.scoreDefinition(subjectDefinition)
  ).map(value => {
    const roundedPercentages = roundPercentages(
      value.performanceLevelScores.map(({ percent }) => percent)
    );

    return {
      ...value,
      performanceLevelScores: value.performanceLevelScores.map(
        (score, index) => ({
          ...score,
          percent: roundedPercentages[index],
          nameCode: metadata.performanceLevelName(
            score.level,
            subjectCode,
            assessmentTypeCode
          ),
          colorCode: metadata.performanceLevelColor(
            score.level,
            subjectCode,
            assessmentTypeCode
          )
        })
      )
    };
  });

  return {
    subjectCode,
    assessmentTypeCode,
    resultCount: examScaleScores.length,
    scoreStatistics: statistics
  };
}