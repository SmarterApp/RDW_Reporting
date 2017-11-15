import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TypeaheadModule } from "ngx-bootstrap";
import { SBButtonTypeahead } from "./sb-button-typeahead.component";
import { SBTypeahead } from "./sb-typeahead.component";

@NgModule({
  declarations: [
    SBTypeahead,
    SBButtonTypeahead
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TypeaheadModule.forRoot()
  ],
  exports: [
    SBTypeahead,
    SBButtonTypeahead
  ]
})
export class RdwFormModule {
}
