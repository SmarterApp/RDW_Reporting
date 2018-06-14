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
import { RdwMenuModule } from "../shared/menu/rdw-menu.module";
import { StudentHistoryTableComponent } from "./results/tables/student-history-table.component";
import { TableModule } from "primeng/table";
import { GroupAssessmentCardComponent } from '../dashboard/group-dashboard/group-assessment-card.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { StudentResultsFilterService } from './results/student-results-filter.service';

@NgModule({
  declarations: [
    StudentComponent,
    StudentResponsesComponent,
    StudentResultsComponent,
    StudentResultsFilterComponent,
    StudentHistoryTableComponent
  ],
  imports: [
    Angulartics2Module.forChild(),
    AssessmentsModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    CsvModule,
    FormsModule,
    PopoverModule.forRoot(),
    ReactiveFormsModule,
    RdwMenuModule,
    ReportModule,
    SharedModule,
    TableModule,
    UserModule,
    DashboardModule
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
    StudentResultsFilterService,
    StudentResponsesResolve,
    StudentResponsesService
  ]
})
export class StudentModule {
}
