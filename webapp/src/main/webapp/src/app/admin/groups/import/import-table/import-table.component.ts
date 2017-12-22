import { Component, OnInit, Input } from '@angular/core';
import { ImportResult } from "../import-result.model";

@Component({
  selector: 'import-table',
  templateUrl: './import-table.component.html'
})
export class ImportTableComponent implements OnInit {

  /**
   * The imports array to display in the table
   */
  @Input()
  public imports: ImportResult[] = [];

  constructor() { }

  ngOnInit() {
  }

}
