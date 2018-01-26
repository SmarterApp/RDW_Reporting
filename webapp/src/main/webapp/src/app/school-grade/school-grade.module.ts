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
import { Angulartics2Module } from "angulartics2";
import { ReportModule } from "../report/report.module";
import { TypeaheadModule } from "ngx-bootstrap";
import { UserModule } from "../user/user.module";
import { OrganizationService } from "./organization.service";
import { SchoolAssessmentExportService } from "./results/school-assessment-export.service";

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
    UserModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AssessmentsModule,
    DropdownModule,
    SharedModule,
    ReportModule,
    TypeaheadModule,
    Angulartics2Module.forChild()
  ],
  exports: [
    SchoolGradeComponent,
    SchoolResultsComponent
  ],
  providers: [
    CurrentSchoolResolve,
    OrganizationService,
    SchoolAssessmentResolve,
    SchoolAssessmentService,
    SchoolAssessmentExportService,
    SchoolService
  ]
})
export class SchoolGradeModule {
}
