import { NgModule } from "@angular/core";
import { StudentComponent } from "./student.component";
import { StudentExamHistoryService } from "./student-exam-history.service";
import { CommonModule } from "../shared/common.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "primeng/components/common/shared";
import { StudentResultsComponent } from "./results/student-results.component";
import { StudentExamHistoryResolve } from "./results/student-exam-history.resolve";
import { AssessmentsModule } from "../assessments/assessments.module";
import { StudentResultsFilterComponent } from "./results/student-results-filter.component";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { StudentHistoryIABTableComponent } from "./results/tables/student-history-iab-table.component";
import { StudentHistoryICASummitiveTableComponent } from "./results/tables/student-history-ica-summitive-table.component";
import { PopoverModule } from "ngx-bootstrap";
import { StudentResponsesComponent } from "./responses/student-responses.component";
import { StudentResponsesService } from "./responses/student-responses.service";
import { StudentResponsesResolve } from "./responses/student-responses.resolve";

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
    AssessmentsModule,
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    DataTableModule,
    FormsModule,
    PopoverModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    StudentComponent,
    StudentResponsesComponent
  ],
  providers: [
    StudentExamHistoryResolve,
    StudentExamHistoryService,
    StudentResponsesResolve,
    StudentResponsesService
  ]
})
export class StudentModule {
}
