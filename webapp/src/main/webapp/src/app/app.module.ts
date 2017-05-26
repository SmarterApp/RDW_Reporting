import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { standaloneProviders } from "./standalone/standalone.service";
import { GroupStudentsComponent } from "./group-students/group-students.component";
import { StudentExamsComponent } from "./student-exams/student-exams.component";
import { GroupExamsComponent } from "./group-exams/group-exams.component";
import { HomeComponent } from "./home/home.component";
import { StudentExamItemsComponent } from "./student-exam-items/student-exam-items.component";
import { StudentExamsCategorizedComponent } from "./student-exams/student-exams-categorized.component";
import { GroupExamItemComponent } from "./group-exam-item/group-exam-item.component";
import { StudentExamReportComponent } from "./student-exam-report/student-exam-report.component";
import { IabReportComponent } from "./student-exam-report/iab-report.component";
import { AdminSearchComponent } from "./admin-search/admin-search.component";
import { StudentExamsResolve } from "./student-exams/student-exam.resolve";
import { StudentExamItemsResolve } from "./student-exam-items/student-exam-items.resolve";
import { GroupExamItemResolve } from "./group-exam-item/group-exam-item.resolve";
import { BreadcrumbsComponent } from "./breadcrumbs/breadcrumbs.component";
import { BsDropdownModule, TabsModule } from "ngx-bootstrap";
import { CommonModule } from "./shared/common.module";
import { GroupsModule } from "./groups/groups.module";
import { UserModule } from "./user/user.module";
import { routes } from "./app.routes";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    AppComponent,
    GroupStudentsComponent,
    StudentExamsComponent,
    StudentExamsCategorizedComponent,
    GroupExamsComponent,
    StudentExamItemsComponent,
    GroupExamItemComponent,
    BreadcrumbsComponent,
    HomeComponent,
    StudentExamReportComponent,
    IabReportComponent,
    AdminSearchComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    GroupsModule,
    RouterModule.forRoot(routes),
    UserModule,
    FormsModule,
    HttpModule,
    BsDropdownModule,
    TabsModule.forRoot()
  ],
  providers: [
     StudentExamsResolve, StudentExamItemsResolve, GroupExamItemResolve,
    ...(environment.standalone ? standaloneProviders : [])
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
