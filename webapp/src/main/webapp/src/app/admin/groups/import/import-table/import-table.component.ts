import { Component, Input } from '@angular/core';
import { ImportResult } from "../import-result.model";

@Component({
  selector: 'import-table',
  templateUrl: './import-table.component.html'
})
export class ImportTableComponent {

  /**
   * The imports array to display in the table
   */
  @Input()
  public imports: ImportResult[] = [];

  columns: Column[] = [
    new Column({id: 'file-name', field: 'fileName'}),
    new Column({id: 'created'}),
    new Column({id: 'status'}),
    new Column({id: 'id'})
  ];

}

class Column {
  id: string;
  field: string;

  constructor({
                id,
                field = ''
  }) {
    this.id = id;
    this.field = field ? field : id;
  }
}
