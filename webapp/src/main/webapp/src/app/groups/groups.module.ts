import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { GroupsComponent } from "./groups.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { DataTableModule, SharedModule } from "primeng/primeng";
import { GroupResultsComponent } from "./results/group-results.component";
import { PopoverModule } from "ngx-bootstrap/popover";
import { AssessmentsModule } from "../assessments/assessments.module";
import { AssessmentsResolve } from "./results/assessments.resolve";
import { AssessmentService } from "./results/assessment/assessment.service";

@NgModule({
  declarations: [
    GroupsComponent,
    GroupResultsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AssessmentsModule,
    FormsModule,
    DataTableModule,
    SharedModule,
    PopoverModule
  ],
  exports: [ GroupsComponent ],
  providers: [ AssessmentsResolve, AssessmentService ]
})
export class GroupsModule {
}
