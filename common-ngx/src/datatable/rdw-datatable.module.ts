import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { DataTableRowExpander } from "./datatable-row-expander.component";

@NgModule({
  declarations: [
    DataTableRowExpander
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    DataTableRowExpander
  ]
})
export class RdwDataTableModule {
}
