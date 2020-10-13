import { Angulartics2Module } from 'angulartics2';
import { NgModule } from '@angular/core';
import { ReportingCommonModule } from '../shared/reporting-common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AggregateReportOptionsService } from './aggregate-report-options.service';
import { AggregateReportOptionsMapper } from './aggregate-report-options.mapper';
import { AggregateReportOrganizationService } from './aggregate-report-organization.service';
import {
  ModalModule,
  PopoverModule,
  TabsModule,
  TypeaheadModule
} from 'ngx-bootstrap';
import { AggregateReportService } from './aggregate-report.service';
import { ReportModule } from '../report/report.module';
import { AggregateReportComponent } from './results/aggregate-report.component';
import { AggregateReportResolve } from './results/aggregate-report.resolve';
import { AggregateReportOptionsResolve } from './aggregate-report-options.resolve';
import { AggregateReportItemMapper } from './results/aggregate-report-item.mapper';
import { AggregateReportTableComponent } from './results/aggregate-report-table.component';
import { AssessmentModule } from './assessment/assessment.module';
import { AggregateReportTableDataService } from './aggregate-report-table-data.service';
import { AggregateReportRequestMapper } from './aggregate-report-request.mapper';
import { ReportQueryResolve } from './report-query.resolve';
import { CsvModule } from '../csv-export/csv-export.module';
import { AggregateReportTableExportService } from './results/aggregate-report-table-export.service';
import { AggregateReportSummary } from './aggregate-report-summary.component';
import { AggregateReportColumnOrderItemProvider } from './aggregate-report-column-order-item.provider';
import { TableModule } from 'primeng/table';
import { LongitudinalCohortChartComponent } from './results/longitudinal-cohort-chart.component';
import { SubgroupModule } from './subgroup/subgroup.module';
import { LongitudinalCohortChartMapper } from './results/longitudinal-cohort-chart.mapper';
import { WideRadioGroupComponent } from './wide-radio-group.component';
import { TargetReportFormComponent } from './query-forms/target-report-form.component';
import { AggregateQueryFormContainerComponent } from './query-forms/aggregate-query-form-container.component';
import { GeneralPopulationFormComponent } from './query-forms/general-population-form.component';
import { LongitudinalCohortFormComponent } from './query-forms/longitudinal-cohort-form.component';
import { ClaimReportFormComponent } from './query-forms/claim-report-form.component';
import { AltScoreReportFormComponent } from './query-forms/alt-score-report-form.component';
import { AggregateTargetOverviewComponent } from './results/aggregate-target-overview.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { aggregateReportRoutes } from './aggregate-report.routes';
import { TranslateModule } from '@ngx-translate/core';
import { translateModuleConfiguration } from '../shared/translate-module-configuration';

@NgModule({
  imports: [
    AssessmentModule,
    Angulartics2Module,
    CommonModule,
    ReportingCommonModule,
    CsvModule,
    FormsModule,
    ModalModule.forRoot(), // this is needed in lazy modules for some reason
    PopoverModule,
    ReactiveFormsModule,
    ReportModule,
    SubgroupModule,
    TableModule,
    TabsModule,
    TypeaheadModule,
    TranslateModule.forChild(translateModuleConfiguration),
    RouterModule.forChild(aggregateReportRoutes)
  ],
  declarations: [
    AggregateQueryFormContainerComponent,
    AggregateReportComponent,
    AggregateReportTableComponent,
    AggregateReportSummary,
    AggregateTargetOverviewComponent,
    ClaimReportFormComponent,
    AltScoreReportFormComponent,
    GeneralPopulationFormComponent,
    LongitudinalCohortChartComponent,
    LongitudinalCohortFormComponent,
    TargetReportFormComponent,
    WideRadioGroupComponent
  ],
  providers: [
    AggregateReportRequestMapper,
    AggregateReportTableDataService,
    AggregateReportTableExportService,
    AggregateReportService,
    WideRadioGroupComponent,
    AggregateReportResolve,
    AggregateReportOptionsResolve,
    AggregateReportOptionsService,
    AggregateReportOptionsMapper,
    AggregateReportOrganizationService,
    AggregateReportItemMapper,
    ReportQueryResolve,
    AggregateReportColumnOrderItemProvider,
    LongitudinalCohortChartMapper
  ]
})
export class AggregateReportsModule {}
