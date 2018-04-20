export interface Subgroup {
  readonly id: string;
  readonly name: string;
  readonly dimensionGroups: DimensionGroup[];
}

export interface DimensionGroup {
  readonly type: string;
  readonly values: DimensionValue[];
}

export interface DimensionValue {
  readonly code: string;
  readonly translationCode: string;
}
