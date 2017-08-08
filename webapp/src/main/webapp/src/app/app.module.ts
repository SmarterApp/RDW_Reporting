import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { standaloneProviders } from "./standalone/standalone.service";
import { HomeComponent } from "./home/home.component";
import { BreadcrumbsComponent } from "./breadcrumbs/breadcrumbs.component";
import { BsDropdownModule, TabsModule, AlertModule } from "ngx-bootstrap";
import { CommonModule } from "./shared/common.module";
import { GroupsModule } from "./groups/groups.module";
import { StudentModule } from "./student/student.module";
import { UserModule } from "./user/user.module";
import { routes } from "./app.routes";
import { RouterModule, RouteReuseStrategy } from "@angular/router";
import { SchoolGradeModule } from "./school-grade/school-grade.module";
import { PopoverModule } from "ngx-bootstrap/popover";
import { TranslateResolve } from "./home/translate.resolve";
import { Angulartics2Module, Angulartics2GoogleAnalytics } from "angulartics2";
import { RdwRouteReuseStrategy } from "./shared/rdw-route-reuse.strategy";
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    BreadcrumbsComponent,
    HomeComponent,
    ErrorComponent
  ],
  imports: [
    AlertModule.forRoot(),
    BrowserModule,
    CommonModule,
    GroupsModule,
    StudentModule,
    SchoolGradeModule,
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
    { provide: RouteReuseStrategy, useClass: RdwRouteReuseStrategy },
    ...(environment.standalone ? standaloneProviders : [])

  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
