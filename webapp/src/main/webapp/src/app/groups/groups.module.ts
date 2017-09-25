import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { GroupsComponent } from "./groups.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { DataTableModule, SharedModule } from "primeng/primeng";
import { GroupResultsComponent } from "./results/group-results.component";
import { AssessmentsModule } from "../assessments/assessments.module";
import { GroupAssessmentService } from "./results/group-assessment.service";
import { GroupAssessmentsResolve } from "./results/group-assessments.resolve";
import { Angulartics2Module } from 'angulartics2';
import { ReportModule } from "../report/report.module";
import { PopoverModule } from "ngx-bootstrap";
import { CustomExportModule } from "../custom-export/custom-export.module";
import { UserModule } from "../user/user.module";

@NgModule({
  declarations: [
    GroupsComponent,
    GroupResultsComponent
  ],
  imports: [
    CommonModule,
    UserModule,
    BrowserModule,
    BrowserAnimationsModule,
    AssessmentsModule,
    FormsModule,
    DataTableModule,
    SharedModule,
    PopoverModule.forRoot(),
    ReportModule,
    CustomExportModule,
    Angulartics2Module.forChild()
  ],
  exports: [ GroupsComponent ],
  providers: [ GroupAssessmentsResolve, GroupAssessmentService ]
})
export class GroupsModule {
}
