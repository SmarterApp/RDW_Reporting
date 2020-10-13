/**
 * This class represents the metadata for a trait category.
 * <p>
 * A trait is associated with a purpose and category. Typically an exam will
 * have trait scores for a single purpose and a few categories. For example,
 * an ELA might have trait scores for "Explanatory" purpose with categories
 * "Evidence", "Organization", and "Conventions". This class represents the
 * info about a single category; in the example, perhaps "Evidence".
 * </p>
 */
export class TraitCategoryInfo {
  type: string;
  maxPoints: number;

  /**
   * @param type trait category code/name, e.g. 'EVI', 'total'
   * @param maxPoints max points achievable
   */
  constructor(type: string, maxPoints: number) {
    this.type = type;
    this.maxPoints = maxPoints;
  }
}
