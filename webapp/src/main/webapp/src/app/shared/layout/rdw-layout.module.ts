import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RdwI18nModule } from "../i18n/rdw-i18n.module";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap";
import { SbBreadcrumbs } from "./sb-breadcrumbs.component";
import { SbFooter } from "./sb-footer.component";
import { PageHeading } from "./page-heading.component";

@NgModule({
  declarations: [
    SbBreadcrumbs,
    SbFooter,
    PageHeading
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RdwI18nModule,
    RouterModule.forRoot([]),
    TranslateModule.forRoot(),
    BsDropdownModule
  ],
  exports: [
    SbBreadcrumbs,
    SbFooter,
    PageHeading
  ]
})
export class RdwLayoutModule {
}
