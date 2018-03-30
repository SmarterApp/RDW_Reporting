import { Angulartics2Module } from "angulartics2";
import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AggregateReportOptionsService } from "./aggregate-report-options.service";
import { AggregateReportOptionsMapper } from "./aggregate-report-options.mapper";
import { AggregateReportOrganizationService } from "./aggregate-report-organization.service";
import {ModalModule, PopoverModule, TabsModule, TypeaheadModule} from "ngx-bootstrap";
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
import { AggregateReportFormSettingsResolve } from "./aggregate-report-form-settings.resolve";
import { StickyDirective } from "../shared/nav/sticky.directive";
import { CsvModule } from "../csv-export/csv-export.module";
import { AggregateReportTableExportService } from "./results/aggregate-report-table-export.service";
import { AggregateReportSummary } from "./aggregate-report-summary.component";
import { AggregateReportColumnOrderItemProvider } from "./aggregate-report-column-order-item.provider";
import { TableModule } from "primeng/table";
import { SubgroupFiltersComponent } from "./subgroup-filters.component";
import {ListGroupComponent} from "./list-group.component";
import {SubgroupMapper} from "./subgroup.mapper";
import { SubgroupFiltersListComponent } from './subgroup-filters-list.component';

@NgModule({
  declarations: [
    AggregateReportFormComponent,
    AggregateReportComponent,
    AggregateReportTableComponent,
    AggregateReportOrganizationList,
    AggregateReportSummary,
    ListGroupComponent,
    StickyDirective,
    SubgroupFiltersComponent,
    SubgroupFiltersListComponent
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
    SubgroupMapper
  ]
})
export class AggregateReportsModule {
}
