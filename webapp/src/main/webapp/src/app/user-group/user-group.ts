import { Utils } from '../shared/support/support';
import { Student } from '../student/search/student';

export interface UserGroup {
  id?: number;
  name: string;
  subjects: string[];
  students: Student[];
}

export interface UserGroupRequest {
  readonly id?: number;
  readonly name: string;
  readonly subjectCodes: string[];
  readonly studentIds: number[];
}

export function copy(group: UserGroup): UserGroup {
  const copied = <any>{};
  if (group.id != null) {
    copied.id = group.id;
  }
  copied.name = group.name;
  if (group.subjects != null) {
    copied.subjects = group.subjects.concat();
  }
  copied.students = group.students.concat();
  return copied;
}

export function equals(a: UserGroup, b: UserGroup): boolean {
  const idsOf = (students: Student[]) => students.map(student => student.id);
  return a === b
    || (
      a != null
      && b != null
      && a.id === b.id
      && a.name === b.name
      && Utils.equalSets(a.subjects, b.subjects)
      && Utils.equalSets(idsOf(a.students), idsOf(b.students))
    );
}
