import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent } from "./app.component";
import { BsDropdownModule, TabsModule } from "ngx-bootstrap";
import { CommonModule } from "./shared/common.module";
import { UserModule } from "./user/user.module";
import { routes } from "./app.routes";
import { RouterModule } from "@angular/router";
import { PopoverModule } from "ngx-bootstrap/popover";
import { Angulartics2GoogleAnalytics, Angulartics2Module } from "angulartics2";
import { GroupImportModule } from "./groups/import/group-import.module";
import { GroupsModule } from "./groups/groups.module";
import { FileFormatModule } from "./groups/import/fileformat/file-format.module";
import { AccessDeniedComponent } from "./access-denied/access-denied.component";
import { InstructionalResourceModule } from "./instructional-resource/instructional-resource.module";
import { HomeComponent } from "./home/home.component";

@NgModule({
  declarations: [
    AppComponent,
    AccessDeniedComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    GroupImportModule,
    GroupsModule,
    InstructionalResourceModule,
    FileFormatModule,
    RouterModule.forRoot(routes),
    UserModule,
    FormsModule,
    HttpModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ])
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
