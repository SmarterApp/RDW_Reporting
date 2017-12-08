import { NgModule } from "@angular/core";
import { StudentComponent } from "./student.component";
import { StudentExamHistoryService } from "./student-exam-history.service";
import { CommonModule } from "../shared/common.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "primeng/components/common/shared";
import { StudentResultsComponent } from "./results/student-results.component";
import { StudentExamHistoryResolve } from "./results/student-exam-history.resolve";
import { AssessmentsModule } from "../assessments/assessments.module";
import { StudentResultsFilterComponent } from "./results/student-results-filter.component";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { StudentHistoryIABTableComponent } from "./results/tables/student-history-iab-table.component";
import { StudentHistoryICASummitiveTableComponent } from "./results/tables/student-history-ica-summitive-table.component";
import { Angulartics2Module } from "angulartics2";
import { StudentResponsesComponent } from "./responses/student-responses.component";
import { StudentResponsesService } from "./responses/student-responses.service";
import { StudentResponsesResolve } from "./responses/student-responses.resolve";
import { StudentHistoryResponsesExamResolve } from "./responses/student-history-responses-exam.resolve";
import { StudentHistoryResponsesAssessmentResolve } from "./responses/student-history-responses-assessment.resolve";
import { StudentHistoryResponsesStudentResolve } from "./responses/student-history-responses-student.resolve";
import { CsvModule } from "../csv-export/csv-export.module";
import { ReportModule } from "../report/report.module";
import { PopoverModule } from "ngx-bootstrap";
import { UserModule } from "../user/user.module";
import { RdwMenuModule } from "@sbac/rdw-reporting-common-ngx";

@NgModule({
  declarations: [
    StudentComponent,
    StudentResponsesComponent,
    StudentResultsComponent,
    StudentResultsFilterComponent,
    StudentHistoryIABTableComponent,
    StudentHistoryICASummitiveTableComponent
  ],
  imports: [
    Angulartics2Module.forChild(),
    AssessmentsModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    CsvModule,
    DataTableModule,
    FormsModule,
    PopoverModule.forRoot(),
    ReactiveFormsModule,
    RdwMenuModule,
    ReportModule,
    SharedModule,
    UserModule
  ],
  exports: [
    StudentComponent,
    StudentResponsesComponent
  ],
  providers: [
    StudentExamHistoryResolve,
    StudentExamHistoryService,
    StudentHistoryResponsesAssessmentResolve,
    StudentHistoryResponsesExamResolve,
    StudentHistoryResponsesStudentResolve,
    StudentResponsesResolve,
    StudentResponsesService
  ]
})
export class StudentModule {
}
