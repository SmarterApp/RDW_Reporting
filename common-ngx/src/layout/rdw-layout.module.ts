import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RdwI18nModule } from "../i18n/rdw-i18n.module";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap";
import { SbBreadcrumbs } from "./sb-breadcrumbs.component";
import { SbHeader } from "./sb-header.component";
import { SbFooter } from "./sb-footer.component";

@NgModule({
  declarations: [
    SbBreadcrumbs,
    SbHeader,
    SbFooter
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
    SbHeader,
    SbFooter
  ]
})
export class RdwLayoutModule {
}
