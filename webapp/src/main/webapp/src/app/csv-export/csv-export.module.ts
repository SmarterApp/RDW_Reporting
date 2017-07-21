import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { CsvBuilder } from "./csv-builder.service";

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule
  ],
  exports: [ ],
  providers: [ CsvBuilder ]
})
export class CsvModule {
}
