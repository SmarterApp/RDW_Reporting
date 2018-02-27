import { NgModule } from "@angular/core";
import { AssessmentPercentileTable } from "./assessment-percentile-table.component";
import { AssessmentPercentileService } from "./assessment-percentile.service";
import { CommonModule } from "../../shared/common.module";
import { TableModule } from "primeng/table";
import { BrowserModule } from "@angular/platform-browser";
import { AssessmentPercentileHistoryComponent } from "./assessment-percentile-history.component";

@NgModule({
  declarations: [
    AssessmentPercentileHistoryComponent,
    AssessmentPercentileTable
  ],
  imports: [
    BrowserModule,
    CommonModule,
    TableModule
  ],
  exports: [
    AssessmentPercentileHistoryComponent
  ],
  providers: [
    AssessmentPercentileService
  ]
})
export class AssessmentPercentileModule {

}
