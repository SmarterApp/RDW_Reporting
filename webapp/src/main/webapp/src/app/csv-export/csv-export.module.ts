import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { CsvBuilder } from "./csv-builder.service";
import { CsvExportService } from "./csv-export.service";
import { Angular2CsvProvider } from "./angular-csv.provider";

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule
  ],
  exports: [ ],
  providers: [
    Angular2CsvProvider,
    CsvBuilder,
    CsvExportService
  ]
})
export class CsvModule {
}
