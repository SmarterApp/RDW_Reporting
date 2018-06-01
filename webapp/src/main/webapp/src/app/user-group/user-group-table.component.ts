import { Component, Input } from '@angular/core';
import { UserGroup } from './user-group';

@Component({
  selector: 'user-group-table',
  templateUrl: './user-group-table.component.html'
})
export class UserGroupTableComponent {

  @Input()
  groups: UserGroup[];

  @Input()
  emptyMessage: string;

  columns: Column[] = [
    new Column({ id: 'group', field: 'name' }),
    new Column({ id: 'subject', field: 'subjects' }),
    new Column({ id: 'action' })
  ];

}

class Column {
  id: string;
  field: string;

  constructor({ id, field = ''}) {
    this.id = id;
    this.field = field;
  }
}
