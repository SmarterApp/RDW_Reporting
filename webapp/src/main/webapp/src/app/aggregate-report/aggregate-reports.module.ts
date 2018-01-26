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
import { QueryBuilderComponent } from "./results/query-builder.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultiselectDropdownModule } from "angular-2-dropdown-multiselect";
import { ReportOptionsService } from "./results/report-options.service";
import { AggregateReportFormResolve } from "./aggregate-report-form.resolve";
import { AggregateReportOptionsService } from "./aggregate-report-options.service";
import { AggregateReportFormOptionsMapper } from "./aggregate-report-form-options.mapper";
import { AggregateReportSummary } from "./aggregate-report-summary.component";
import { AggregateReportsPreviewTableComponent } from "./aggregate-reports-preview-table.component";
import { MockAggregateReportsPreviewService } from "./results/mock-aggregate-reports-preview.service";
import { OrganizationSelect } from "./organization-select.component";
import { AggregateReportOrganizationService } from "./aggregate-report-organization.service";
import { TypeaheadModule } from "ngx-bootstrap";
import { AggregateReportOrganizationList } from "./aggregate-report-organization-list.component";

@NgModule({
  declarations: [
    AggregateReportsComponent,
    AggregateReportsResultsComponent,
    AggregateReportsTableComponent,
    AggregateReportsPreviewTableComponent,
    PerformanceComparisonComponent,
    QueryBuilderComponent,
    AggregateReportSummary,
    OrganizationSelect,
    AggregateReportOrganizationList
  ],
  imports: [
    Angulartics2Module.forChild(),
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DataTableModule,
    MultiselectDropdownModule,
    TypeaheadModule
  ],
  exports: [
    AggregateReportsComponent,
    AggregateReportsResultsComponent,
    AggregateReportsTableComponent,
    AggregateReportsPreviewTableComponent,
    PerformanceComparisonComponent,
    QueryBuilderComponent
  ],
  providers: [
    AssessmentDetailsService,
    MockAggregateReportsService,
    MockAggregateReportsPreviewService,
    ReportOptionsService,
    AggregateReportFormResolve,
    AggregateReportOptionsService,
    AggregateReportFormOptionsMapper,
    AggregateReportOrganizationService
  ]
})
export class AggregateReportsModule {
}
