import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { CsvBuilder } from "./csv-builder.service";
import { CsvExportService } from "./csv-export.service";
import { Angular2CsvProvider } from "./angular-csv.provider";
import { RdwFormatModule } from "@sbac/rdw-reporting-common-ngx";

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    RdwFormatModule
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
