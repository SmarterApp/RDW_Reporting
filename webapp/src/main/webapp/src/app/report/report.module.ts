import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "primeng/components/common/shared";
import { ModalModule } from "ngx-bootstrap";
import { Angulartics2Module } from "angulartics2";
import { ReportService } from "./report.service";
import { CommonModule } from "../shared/common.module";
import { StudentReportDownloadComponent } from "./student-report-download.component";
import { ReportsResolve } from "./reports.resolve";
import { ReportsComponent } from "./reports.component";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { GroupReportDownloadComponent } from "./group-report-download.component";
import { SchoolGradeDownloadComponent } from "./school-grade-report-download.component";
import { ReportActionService } from "./report-action.service";
import { ReportActionComponent } from "./report-action.component";
import { RdwMenuModule } from "../shared/menu/rdw-menu.module";

@NgModule({
  declarations: [
    ReportsComponent,
    StudentReportDownloadComponent,
    GroupReportDownloadComponent,
    SchoolGradeDownloadComponent,
    ReportActionComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    DataTableModule,
    RdwMenuModule,
    Angulartics2Module.forChild()
  ],
  exports: [
    ReportsComponent,
    StudentReportDownloadComponent,
    GroupReportDownloadComponent,
    SchoolGradeDownloadComponent
  ],
  providers: [
    ReportService,
    ReportsResolve,
    ReportActionService
  ]
})
export class ReportModule {
}
