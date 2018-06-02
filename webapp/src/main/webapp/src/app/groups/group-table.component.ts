import { Component, Input } from '@angular/core';
import { Group } from './group';

@Component({
  selector: 'group-table',
  templateUrl: 'group-table.component.html'
})
export class GroupTableComponent {

  @Input()
  groups: Group[];

  columns: Column[] = [
    new Column({ id: 'group', field: 'name' }),
    new Column({ id: 'school', field: 'schoolName' }),
    new Column({ id: 'subject', field: 'subjectCode' })
  ];

}

class Column {
  id: string;
  field: string;

  constructor({ id, field = '' }) {
    this.id = id;
    this.field = field;
  }
}
