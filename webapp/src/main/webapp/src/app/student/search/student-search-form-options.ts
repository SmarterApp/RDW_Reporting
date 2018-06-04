import { Group } from '../../groups/group';
import { School } from '../../shared/organization/organization';
import { UserGroup } from '../../user-group/user-group';

export class StudentSearchFormOptions {
  readonly schools: School[];
  readonly groups: Group[];
  readonly userGroups: UserGroup[];
}
