import { Component, Input } from "@angular/core";
import { Table } from "primeng/table";
import { Utils } from "../support/support";

/**
 * This component is responsible for toggling the expansion of a table row.
 */
@Component({
  selector: 'table-row-expander',
  template: `
    <button class="btn btn-info btn-xs btn-block text-left label-max-width" (click)="toggle()" title="{{text}}"><i class="fa" [ngClass]="{'fa-caret-square-o-down': !expanded, 'fa-caret-square-o-up': expanded, 'mr-xs': hasText}"></i> {{text}}</button>
  `
})
export class TableRowExpander {

  @Input()
  table: Table;

  @Input()
  row: any;

  @Input()
  text: string = '';

  toggle(): void {
    this.table.toggleRow(this.row);
  }

  get expanded(): boolean {
    return this.table.isRowExpanded(this.row);
  }

  get hasText(): boolean {
    return !Utils.isNullOrEmpty(this.text);
  }

}
