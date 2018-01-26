import { WritingTraitAggregate } from "./writing-trait-aggregate.model";
import { WritingTrait } from "./writing-trait.model";

/**
 * This class represents a writing trait score summary report (e.g. all of the rows of aggregate writing traits)
 */
export class WritingTraitScoreSummary {
  evidence: WritingTraitAggregate = new WritingTraitAggregate(WritingTrait.evidence());
  organization: WritingTraitAggregate = new WritingTraitAggregate(WritingTrait.organization());
  conventions: WritingTraitAggregate = new WritingTraitAggregate(WritingTrait.conventions());
  total: WritingTraitAggregate = new WritingTraitAggregate(WritingTrait.total());

  get rows(): WritingTraitAggregate[] {
    return [this.evidence, this.organization, this.conventions, this.total];
  }
}
