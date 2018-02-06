import { WritingTraitType } from "./writing-trait-type.model";

/**
 * This class represents one of the writing traits (Evidence, Organization, Conventions)
 */
export class WritingTrait {
  type: WritingTraitType;
  maxPoints: number;

  constructor(type: WritingTraitType, maxPoints: number) {
    this.type = type;
    this.maxPoints = maxPoints;
  }

  static evidence(): WritingTrait {
    return new WritingTrait(WritingTraitType.Evidence, 4);
  }

  static organization(): WritingTrait {
    return new WritingTrait(WritingTraitType.Organization, 4);
  }

  static conventions(): WritingTrait {
    return new WritingTrait(WritingTraitType.Conventions, 2);
  }

  static total(): WritingTrait {
    return new WritingTrait(WritingTraitType.Total, 6);
  }
}
