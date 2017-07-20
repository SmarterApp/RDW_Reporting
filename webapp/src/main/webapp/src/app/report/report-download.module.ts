import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "primeng/components/common/shared";
import { ModalModule } from "ngx-bootstrap";
import { Angulartics2Module } from "angulartics2";
import { ReportDownloadService } from "./report-download.service";
import { CommonModule } from "../shared/common.module";
import { StudentReportDownloadComponent } from "./student-report-download.component";

@NgModule({
  declarations: [
    StudentReportDownloadComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ModalModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    Angulartics2Module.forChild()
  ],
  exports: [
    StudentReportDownloadComponent
  ],
  providers: [
    ReportDownloadService
  ]
})
export class ReportDownloadModule {
}
