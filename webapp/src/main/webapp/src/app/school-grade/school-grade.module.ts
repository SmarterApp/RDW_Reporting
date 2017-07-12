import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule, DropdownModule } from "primeng/primeng";
import { SchoolGradeComponent } from "./school-grade.component";
import { SchoolService } from "./school.service";
import { SchoolResultsComponent } from "./results/school-results.component";
import { SchoolAssessmentResolve } from "./results/school-assessments.resolve";
import { AssessmentsModule } from "../assessments/assessments.module";
import { SchoolAssessmentService } from "./results/school-assessment.service";
import { CurrentSchoolResolve } from "./results/current-school.resolve";
import { Angulartics2Module } from 'angulartics2';

/**
 * This module contains a search component for finding assessments
 * by school and grade.
 */
@NgModule({
  declarations: [
    SchoolGradeComponent,
    SchoolResultsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AssessmentsModule,
    DropdownModule,
    SharedModule,
    Angulartics2Module.forChild()
  ],
  exports: [ SchoolGradeComponent, SchoolResultsComponent ],
  providers: [
    SchoolAssessmentResolve,
    CurrentSchoolResolve,
    SchoolService,
    SchoolAssessmentService
  ]
})
export class SchoolGradeModule {
}
