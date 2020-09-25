import { TraitCategoryAggregate } from './trait-category-aggregate.model';
import { TraitCategoryInfo } from './trait-category-info.model';
import { WritingTraitType } from './writing-trait-type.model';
import WritingTraitUtils from './writing-trait-utils';

/**
 * This class represents a trait score summary report, a collection of the trait category aggregates.
 * This corresponds to all rows in the trait score summary table.
 */
export class TraitScoreSummary {
  aggregators: Map<string, TraitCategoryAggregate>;
  sorter: (t1: TraitCategoryAggregate, t2: TraitCategoryAggregate) => number;

  constructor(sort = true) {
    this.aggregators = new Map();
    if (sort) {
      this.sorter = (t1, t2) =>
        t2.trait.maxPoints - t1.trait.maxPoints ||
        t1.trait.type.localeCompare(t2.trait.type);
    }
  }

  get rows(): TraitCategoryAggregate[] {
    const allRows = Array.from(this.aggregators.values());
    return this.sorter ? allRows.sort(this.sorter) : allRows;
  }

  /**
   * Return the maximum count of numbers (max-points) of all the category aggregates.
   *
   * As an example, consider the InterimTraitScoreSummary: it has four category
   * aggregates: evidence and organization have 4 numbers, conventions has 2, and total has 6.
   * So this method will return 6, the maximum of those.
   */
  get maxNumbers(): number {
    let max = 0;
    this.aggregators.forEach(aggregate => {
      if (aggregate.numbers.length > max) {
        max = aggregate.numbers.length;
      }
    });
    return max;
  }

  static of(traits: TraitCategoryInfo[]) {
    const summary = new TraitScoreSummary();
    traits.forEach(trait =>
      summary.aggregators.set(trait.type, new TraitCategoryAggregate(trait))
    );
    return summary;
  }

  static InterimTraitScoreSummary() {
    return new InterimTraitScoreSummary();
  }
}

/**
 * Interim assessments are hard-coded to show only the legacy (ELA) writing trait scores.
 * This class specializes TraitScoreSummary to provide that data.
 */
class InterimTraitScoreSummary extends TraitScoreSummary {
  constructor() {
    super(false);
    [
      WritingTraitUtils.evidence(),
      WritingTraitUtils.organization(),
      WritingTraitUtils.conventions(),
      WritingTraitUtils.total()
    ].forEach(trait =>
      this.aggregators.set(trait.type, new TraitCategoryAggregate(trait))
    );
  }

  get evidence() {
    return this.aggregators.get(WritingTraitType.Evidence);
  }

  get organization() {
    return this.aggregators.get(WritingTraitType.Organization);
  }

  get conventions() {
    return this.aggregators.get(WritingTraitType.Conventions);
  }

  get total() {
    return this.aggregators.get(WritingTraitType.Total);
  }
}
