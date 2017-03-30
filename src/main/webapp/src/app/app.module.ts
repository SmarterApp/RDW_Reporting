import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Http, HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {TabsModule} from "ng2-bootstrap/tabs";
import {PadStartPipe} from "./shared/pad-start.pipe";
import {AppComponent} from "./app.component";
import {DataService} from "./shared/data.service";
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from "ng2-translate";
import {environment} from "../environments/environment";
import {standaloneProviders} from "./standalone/standalone.service";
import {GroupStudentsComponent} from "./group-students/group-students.component";
import {StudentExamsComponent} from "./student-exams/student-exams.component";
import {GroupExamsComponent} from "./group-exams/group-exams.component";
import {routes} from "./shared/routes";
import {GroupsComponent} from "./groups/groups.component";
import {HomeComponent} from "./home/home.component";
import {StudentExamItemsComponent} from "./student-exam-items/student-exam-items.component";
import {BreadcrumbsComponent} from "./breadcrumbs/breadcrumbs.component";
import {SearchPipe} from "./search.pipe";
import {BreadcrumbComponent} from "./breadcrumbs/breadcrumb.component";
import {StudentExamsCategorizedComponent} from "./student-exams/student-exams-categorized.component";
import {GroupExamItemComponent} from "./group-exam-item/group-exam-item.component";
import {StudentExamReportComponent} from "./student-exam-report/student-exam-report.component";
import {IabReportComponent} from "./student-exam-report/iab-report.component";
import { AdminSearchComponent } from './admin-search/admin-search.component';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, '/api/translations', '');
}

@NgModule({
  declarations: [
    PadStartPipe,
    SearchPipe,
    AppComponent,
    GroupsComponent,
    GroupStudentsComponent,
    StudentExamsComponent,
    StudentExamsCategorizedComponent,
    GroupExamsComponent,
    StudentExamItemsComponent,
    GroupExamItemComponent,
    BreadcrumbsComponent,
    BreadcrumbComponent,
    HomeComponent,
    StudentExamReportComponent,
    IabReportComponent,
    AdminSearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    TabsModule.forRoot()
  ],
  providers: [
    DataService,
    ...(environment.standalone ? standaloneProviders : [])
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
