import { NgModule } from "@angular/core";
import { TypeaheadModule } from "ngx-bootstrap";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { SchoolTypeahead } from "../school/school-typeahead";

@NgModule({
  declarations: [
    SchoolTypeahead
  ],
  imports: [
    BrowserModule,
    FormsModule,
    TranslateModule.forRoot(),
    TypeaheadModule
  ],
  exports: [
    SchoolTypeahead
  ]
})
export class SchoolModule {
}
