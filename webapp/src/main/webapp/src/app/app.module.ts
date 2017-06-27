import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { standaloneProviders } from "./standalone/standalone.service";
import { HomeComponent } from "./home/home.component";
import { BreadcrumbsComponent } from "./breadcrumbs/breadcrumbs.component";
import { BsDropdownModule, TabsModule } from "ngx-bootstrap";
import { CommonModule } from "./shared/common.module";
import { GroupsModule } from "./groups/groups.module";
import { UserModule } from "./user/user.module";
import { routes } from "./app.routes";
import { RouterModule } from "@angular/router";
import { SchoolGradeModule } from "./school-grade/school-grade.module";
import { PopoverModule } from "ngx-bootstrap/popover";

@NgModule({
  declarations: [
    AppComponent,
    BreadcrumbsComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    GroupsModule,
    SchoolGradeModule,
    RouterModule.forRoot(routes),
    UserModule,
    FormsModule,
    HttpModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot()
  ],
  providers: [
    ...(environment.standalone ? standaloneProviders : [])
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
