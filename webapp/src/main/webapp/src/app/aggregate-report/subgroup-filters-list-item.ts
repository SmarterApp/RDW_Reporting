import { SubgroupFilters } from './subgroup-filters';

export interface SubgroupFiltersListItem {
  readonly id: string;
  readonly name: string;
  readonly value: SubgroupFilters;
}
