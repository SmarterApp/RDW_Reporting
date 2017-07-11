import { ScoringCriterion } from "./scoring-criterion.model";

export class ItemScoringGuide {
  answerKeyValue: string;

  rubrics: ScoringCriterion[] = [];
  exemplars: ScoringCriterion[] = [];
}
