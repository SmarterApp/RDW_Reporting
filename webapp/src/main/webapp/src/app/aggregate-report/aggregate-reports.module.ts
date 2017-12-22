import { Angulartics2Module } from "angulartics2";
import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { DataTableModule } from "primeng/primeng";
import { AggregateReportsComponent } from "./aggregate-reports.component";
import { AggregateReportsResultsComponent } from "./results/aggregate-reports-results.component";
import { MockAggregateReportsService } from "./results/mock-aggregate-reports.service";
import { BrowserModule } from "@angular/platform-browser";
import { AggregateReportsTableComponent } from "./results/aggregate-reports-table.component";
import { AssessmentDetailsService } from "./results/assessment-details.service";
import { PerformanceComparisonComponent } from "./results/performance-comparison.component";

@NgModule({
  declarations: [
    AggregateReportsComponent,
    AggregateReportsResultsComponent,
    AggregateReportsTableComponent,
    PerformanceComparisonComponent
  ],
  imports: [
    Angulartics2Module.forChild(),
    BrowserModule,
    CommonModule,
    DataTableModule
  ],
  exports: [
    AggregateReportsComponent,
    AggregateReportsResultsComponent,
    AggregateReportsTableComponent,
    PerformanceComparisonComponent
  ],
  providers: [
    AssessmentDetailsService,
    MockAggregateReportsService
  ]
})
export class AggregateReportsModule {
}
