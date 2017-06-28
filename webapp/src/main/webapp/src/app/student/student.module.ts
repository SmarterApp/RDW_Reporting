import { NgModule } from "@angular/core";
import { StudentComponent } from "./student.component";
import { StudentExamHistoryService } from "./student-exam-history.service";
import { CommonModule } from "../shared/common.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "primeng/components/common/shared";

@NgModule({
  declarations: [
    StudentComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [ StudentComponent ],
  providers: [
    StudentExamHistoryService
  ]
})
export class StudentModule {
}
