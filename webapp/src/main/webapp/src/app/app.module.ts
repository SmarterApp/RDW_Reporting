import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { AlertModule, BsDropdownModule, PopoverModule, TabsModule } from "ngx-bootstrap";
import { CommonModule } from "./shared/common.module";
import { GroupsModule } from "./groups/groups.module";
import { StudentModule } from "./student/student.module";
import { UserModule } from "./user/user.module";
import { routes } from "./app.routes";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { SchoolGradeModule } from "./school-grade/school-grade.module";
import { TranslateResolve } from "./home/translate.resolve";
import { Angulartics2GoogleAnalytics, Angulartics2Module } from "angulartics2";
import { RdwRouteReuseStrategy } from "./shared/rdw-route-reuse.strategy";
import { ErrorComponent } from './error/error.component';
import { AccessDeniedComponent } from './error/access-denied/access-denied.component';
import { OrganizationExportModule } from "./organization-export/organization-export.module";

@NgModule({
  declarations: [
    AppComponent,
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
    { provide: RouteReuseStrategy, useClass: RdwRouteReuseStrategy }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
