import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { DataTableRowExpander } from "./datatable-row-expander.component";
import { TableModule } from "primeng/table";
import { TableRowExpander } from "./table-row-expander.component";

@NgModule({
  declarations: [
    DataTableRowExpander,
    TableRowExpander
  ],
  imports: [
    BrowserModule,
    FormsModule,
    TableModule
  ],
  exports: [
    DataTableRowExpander,
    TableRowExpander
  ]
})
export class RdwDataTableModule {
}
