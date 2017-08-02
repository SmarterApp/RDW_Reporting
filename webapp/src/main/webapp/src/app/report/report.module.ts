import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "primeng/components/common/shared";
import { PopoverModule } from "ngx-bootstrap";
import { Angulartics2Module } from "angulartics2";
import { ReportService } from "./report.service";
import { CommonModule } from "../shared/common.module";
import { StudentReportDownloadComponent } from "./student-report-download.component";
import { ReportsResolve } from "./reports.resolve";
import { ReportsComponent } from "./reports.component";
import { DataTableModule } from "primeng/components/datatable/datatable";

@NgModule({
  declarations: [
    StudentReportDownloadComponent,
    ReportsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    PopoverModule.forRoot(),
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    DataTableModule,
    Angulartics2Module.forChild()
  ],
  exports: [
    StudentReportDownloadComponent,
    ReportsComponent
  ],
  providers: [
    ReportService,
    ReportsResolve
  ]
})
export class ReportModule {
}
