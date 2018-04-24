import { Angulartics2Module } from "angulartics2";
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from "../shared/common.module";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AggregateReportOptionsService } from "./aggregate-report-options.service";
import { AggregateReportOptionsMapper } from "./aggregate-report-options.mapper";
import { AggregateReportOrganizationService } from "./aggregate-report-organization.service";
import { ModalModule, PopoverModule, TabsModule, TypeaheadModule } from "ngx-bootstrap";
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
import { AggregateReportFormSettingsResolve } from "./aggregate-report-form-settings.resolve";
import { StickyDirective } from "../shared/nav/sticky.directive";
import { CsvModule } from "../csv-export/csv-export.module";
import { AggregateReportTableExportService } from "./results/aggregate-report-table-export.service";
import { AggregateReportSummary } from "./aggregate-report-summary.component";
import { AggregateReportColumnOrderItemProvider } from "./aggregate-report-column-order-item.provider";
import { TableModule } from "primeng/table";
import { ListGroupComponent } from "./list-group.component";
import { EditableListGroupComponent } from './editable-list-group.component';
import { LongitudinalCohortChartComponent } from './results/longitudinal-cohort-chart.component';
import { LongitudinalPlaygroundComponent } from './results/longitudinal-playground.component';
import { SubgroupModule } from './subgroup/subgroup.module';

@NgModule({
  declarations: [
    AggregateReportFormComponent,
    AggregateReportComponent,
    AggregateReportTableComponent,
    AggregateReportSummary,
    EditableListGroupComponent,
    ListGroupComponent,
    LongitudinalCohortChartComponent,
    LongitudinalPlaygroundComponent,
    StickyDirective
  ],
  imports: [
    AssessmentModule,
    Angulartics2Module.forChild(),
    BrowserModule,
    CommonModule,
    CsvModule,
    FormsModule,
    ModalModule,
    PopoverModule.forRoot(),
    ReactiveFormsModule,
    ReportModule,
    SubgroupModule,
    TableModule,
    TabsModule.forRoot(),
    TypeaheadModule
  ],
  exports: [
    AggregateReportComponent,
    AggregateReportFormComponent
  ],
  providers: [
    AggregateReportRequestMapper,
    AggregateReportTableDataService,
    AggregateReportTableExportService,
    AggregateReportService,
    AggregateReportResolve,
    AggregateReportOptionsResolve,
    AggregateReportOptionsService,
    AggregateReportOptionsMapper,
    AggregateReportOrganizationService,
    AggregateReportItemMapper,
    AggregateReportFormSettingsResolve,
    AggregateReportColumnOrderItemProvider,
    LongitudinalPlaygroundComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AggregateReportsModule {
}
