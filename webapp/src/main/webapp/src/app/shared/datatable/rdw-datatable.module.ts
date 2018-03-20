import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { TableRowExpander } from "./table-row-expander.component";

@NgModule({
  declarations: [
    TableRowExpander
  ],
  imports: [
    BrowserModule,
    FormsModule,
    TableModule
  ],
  exports: [
    TableRowExpander
  ]
})
export class RdwDataTableModule {
}
