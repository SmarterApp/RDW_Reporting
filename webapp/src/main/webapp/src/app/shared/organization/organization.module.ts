import { OrganizationMapper } from "./organization.mapper";
import { NgModule } from "@angular/core";
import { OrganizationTypeahead } from "./organization-typeahead";
import { TypeaheadModule } from "ngx-bootstrap";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { SchoolTypeahead } from "./school-typeahead";

@NgModule({
  declarations: [
    OrganizationTypeahead,
    SchoolTypeahead
  ],
  imports: [
    BrowserModule,
    FormsModule,
    TranslateModule.forRoot(),
    TypeaheadModule
  ],
  exports: [
    OrganizationTypeahead,
    SchoolTypeahead
  ],
  providers: [
    OrganizationMapper
  ]
})
export class OrganizationModule {
}
