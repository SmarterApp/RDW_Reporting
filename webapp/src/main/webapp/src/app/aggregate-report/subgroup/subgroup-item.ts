import { SubgroupFilters } from './subgroup-filters';
import { Subgroup } from './subgroup';

export interface SubgroupItem {
  readonly source: SubgroupFilters;
  readonly subgroup: Subgroup;
}
