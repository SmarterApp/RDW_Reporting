import { TraitCategoryInfo } from './trait-category-info.model';

/**
 * An aggregate representation of trait category scores for a group of results.
 * This corresponds to a single row in the trait score summary table.
 */
export class TraitCategoryAggregate {
  trait: TraitCategoryInfo;
  average: number;
  numbers: number[] = [];
  percents: number[] = [];

  constructor(trait: TraitCategoryInfo) {
    this.trait = trait;

    for (let i = 0; i <= trait.maxPoints; i++) {
      this.numbers.push(0);
      this.percents.push(0);
    }
  }
}
