import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { CsvBuilder } from "./csv-builder.service";
import { CsvExportService } from "./csv-export.service";

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule
  ],
  exports: [ ],
  providers: [
    CsvBuilder,
    CsvExportService
  ]
})
export class CsvModule {
}
