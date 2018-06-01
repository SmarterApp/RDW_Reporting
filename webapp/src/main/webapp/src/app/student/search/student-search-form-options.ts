import { Group } from '../../groups/group';
import { School } from '../../shared/organization/organization';

export class StudentSearchFormOptions {
  readonly schools: School[];
  readonly groups: Group[];
}
