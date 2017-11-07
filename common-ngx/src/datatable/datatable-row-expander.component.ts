import { Component, Input } from "@angular/core";
import { DataTable } from "primeng/components/datatable/datatable";
import { Utils } from "../support";

/**
 * This component is responsible for displaying user notifications.
 */
@Component({
  selector: 'datatable-row-expander',
  templateUrl: 'datatable-row-expander.component.html'
})
export class DataTableRowExpander {

  @Input()
  datatable: DataTable;

  @Input()
  row: any;

  @Input()
  text: string = '';

  toggle(): void {
    this.datatable.toggleRow(this.row);
  }

  get expanded(): boolean {
    return this.datatable.isRowExpanded(this.row);
  }

  get hasText(): boolean {
    return !Utils.isNullOrEmpty(this.text);
  }

}
