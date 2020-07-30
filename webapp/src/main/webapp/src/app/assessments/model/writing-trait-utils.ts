import { TraitCategoryInfo } from './trait-category-info.model';
import { WritingTraitType } from './writing-trait-type.model';

/**
 * This utility class has helpers to create the legacy writing trait categories (Evidence, Organization, Conventions).
 * These values are hard-coded based on the SmarterBalanced ELA assessment definition.
 *
 * @see TraitCategoryInfo
 */
export default class WritingTraitUtils {
  static evidence(): TraitCategoryInfo {
    return new TraitCategoryInfo(WritingTraitType.Evidence, 4);
  }

  static organization(): TraitCategoryInfo {
    return new TraitCategoryInfo(WritingTraitType.Organization, 4);
  }

  static conventions(): TraitCategoryInfo {
    return new TraitCategoryInfo(WritingTraitType.Conventions, 2);
  }

  static total(): TraitCategoryInfo {
    return new TraitCategoryInfo(WritingTraitType.Total, 6);
  }
}
