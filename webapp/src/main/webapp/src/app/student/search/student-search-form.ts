import { Group } from '../../groups/group';
import { School } from '../../shared/organization/organization';

export interface StudentSearchForm {
  school?: School;
  group?: Group;
  name: string;
}
