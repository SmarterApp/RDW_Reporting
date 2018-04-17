import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TypeaheadModule } from "ngx-bootstrap";
import { SBButtonTypeahead } from "./sb-button-typeahead.component";
import { SBTypeahead } from "./sb-typeahead.component";
import { SBCheckboxGroup } from "./sb-checkbox-group.component";
import { Angulartics2Module } from "angulartics2";
import { TranslateModule } from "@ngx-translate/core";
import { SBButtonGroup } from './sb-button-group';
import { SBRadioGroup } from './sb-radio-group';

@NgModule({
  declarations: [
    SBTypeahead,
    SBButtonTypeahead,
    SBCheckboxGroup,
    SBButtonGroup,
    SBRadioGroup
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TypeaheadModule.forRoot(),
    TranslateModule.forRoot(),
    Angulartics2Module.forChild(),
  ],
  exports: [
    SBTypeahead,
    SBButtonTypeahead,
    SBCheckboxGroup,
    SBButtonGroup,
    SBRadioGroup
  ]
})
export class RdwFormModule {
}
