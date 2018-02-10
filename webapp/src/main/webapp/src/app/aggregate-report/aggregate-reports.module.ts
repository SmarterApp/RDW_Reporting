import { Angulartics2Module } from "angulartics2";
import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { DataTableModule } from "primeng/primeng";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultiselectDropdownModule } from "angular-2-dropdown-multiselect";
import { AggregateReportOptionsService } from "./aggregate-report-options.service";
import { AggregateReportFormOptionsMapper } from "./aggregate-report-form-options.mapper";
import { AggregateReportSummary } from "./aggregate-report-summary.component";
import { AggregateReportOrganizationService } from "./aggregate-report-organization.service";
import { ModalModule, TypeaheadModule } from "ngx-bootstrap";
import { AggregateReportOrganizationList } from "./aggregate-report-organization-list.component";
import { AggregateReportService } from "./aggregate-report.service";
import { ReportModule } from "../report/report.module";
import { AggregateReportFormComponent } from "./aggregate-report-form.component";
import { AggregateReportComponent } from "./results/aggregate-report.component";
import { AggregateReportResolve } from "./results/aggregate-report.resolve";
import { AggregateReportOptionsResolve } from "./aggregate-report-options.resolve";
import { AggregateReportItemMapper } from "./results/aggregate-report-item.mapper";
import { AggregateReportTableComponent } from "./results/aggregate-report-table.component";
import { AssessmentModule } from "./assessment/assessment.module";
import { AggregateReportTableDataService } from "./aggregate-report-table-data.service";
import { AggregateReportRequestMapper } from "./aggregate-report-request.mapper";
import { PerformanceLevelDistributionChart } from "./performance-level-distribution-chart.component";
import { AggregateReportFormSettingsResolve } from "./aggregate-report-form-settings.resolve";

@NgModule({
  declarations: [
    AggregateReportFormComponent,
    AggregateReportComponent,
    AggregateReportTableComponent,
    AggregateReportSummary,
    AggregateReportOrganizationList,
    PerformanceLevelDistributionChart
  ],
  imports: [
    AssessmentModule,
    Angulartics2Module.forChild(),
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DataTableModule,
    MultiselectDropdownModule,
    TypeaheadModule,
    ModalModule,
    ReportModule
  ],
  exports: [
    AggregateReportComponent,
    AggregateReportFormComponent
  ],
  providers: [
    AggregateReportRequestMapper,
    AggregateReportTableDataService,
    AggregateReportService,
    AggregateReportResolve,
    AggregateReportOptionsResolve,
    AggregateReportOptionsService,
    AggregateReportFormOptionsMapper,
    AggregateReportOrganizationService,
    AggregateReportItemMapper,
    AggregateReportFormSettingsResolve
  ]
})
export class AggregateReportsModule {
}
