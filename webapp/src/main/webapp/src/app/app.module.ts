import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule, Http } from "@angular/http";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { BreadcrumbsComponent } from "./breadcrumbs/breadcrumbs.component";
import { BsDropdownModule, TabsModule, AlertModule, PopoverModule } from "ngx-bootstrap";
import { CommonModule } from "./shared/common.module";
import { GroupsModule } from "./groups/groups.module";
import { StudentModule } from "./student/student.module";
import { UserModule } from "./user/user.module";
import { routes } from "./app.routes";
import { RouterModule, RouteReuseStrategy } from "@angular/router";
import { SchoolGradeModule } from "./school-grade/school-grade.module";
import { TranslateResolve } from "./home/translate.resolve";
import { Angulartics2Module, Angulartics2GoogleAnalytics } from "angulartics2";
import { RdwRouteReuseStrategy } from "./shared/rdw-route-reuse.strategy";
import { ErrorComponent } from './error/error.component';
import { AuthenticatedHttpService } from "./shared/authentication/authenticated-http.service";
import { AccessDeniedComponent } from './error/access-denied/access-denied.component';
import { OrganizationExportModule } from "./organization-export/organization-export.module";

@NgModule({
  declarations: [
    AppComponent,
    BreadcrumbsComponent,
    HomeComponent,
    ErrorComponent,
    AccessDeniedComponent
  ],
  imports: [
    AlertModule.forRoot(),
    BrowserModule,
    CommonModule,
    GroupsModule,
    StudentModule,
    SchoolGradeModule,
    OrganizationExportModule,
    RouterModule.forRoot(routes),
    UserModule,
    FormsModule,
    HttpModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ])
  ],
  providers: [
    TranslateResolve,
    { provide: Http, useClass: AuthenticatedHttpService },
    { provide: RouteReuseStrategy, useClass: RdwRouteReuseStrategy }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
