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
import { UpdateQueryComponent } from "./results/update-query.component";
import { FormsModule } from "@angular/forms";
import { OrganizationExportModule } from "../organization-export/organization-export.module";

@NgModule({
  declarations: [
    AggregateReportsComponent,
    AggregateReportsResultsComponent,
    AggregateReportsTableComponent,
    PerformanceComparisonComponent,
    UpdateQueryComponent
  ],
  imports: [
    Angulartics2Module.forChild(),
    BrowserModule,
    FormsModule,
    CommonModule,
    DataTableModule,
    OrganizationExportModule
  ],
  exports: [
    AggregateReportsComponent,
    AggregateReportsResultsComponent,
    AggregateReportsTableComponent,
    PerformanceComparisonComponent,
    UpdateQueryComponent
  ],
  providers: [
    AssessmentDetailsService,
    MockAggregateReportsService
  ]
})
export class AggregateReportsModule {
}
