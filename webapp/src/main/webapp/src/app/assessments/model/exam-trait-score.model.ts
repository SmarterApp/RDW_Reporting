/**
 * An ExamTraitScore contains a single trait score for an exam-level trait.
 *
 * An exam may have trait scores. These include purpose and category. They are typically
 * grouped by purpose, then category; and a single exam will have trait scores for a
 * single purpose. For example, an ELA exam may have trait scores for "EXPL" purpose,
 * with categories "EVI", "ORG", and "CON". Different exams for the same assessment may
 * have trait scores for different purposes.
 *
 * NOTE for the possibly confused: exam-item-score contains WritingTraitScores. These are trait
 * scores for legacy tests with WER items, specifically (and only) SmarterBalanced ELA IAB/ICA.
 * For those tests, the WER trait scores are provided at the item level. The exam-level scores
 * represented by this ExamTraitScore class are provided for summative assessments.
 */
export interface ExamTraitScore {
  score: number;
  conditionCode: string;
  purpose: string;
  category: string;
  maxScore: number;
}
