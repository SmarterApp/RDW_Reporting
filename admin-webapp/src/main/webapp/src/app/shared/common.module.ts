import { NgModule } from "@angular/core";
import { PadStartPipe } from "./pad-start.pipe";
import { SubjectPipe } from "./subject.pipe";
import { SchoolYearPipe } from "./schoolYear.pipe";
import { SearchPipe } from "../search.pipe";
import { HttpModule, Http } from "@angular/http";
import { DataService } from "./data/data.service";
import { CachingDataService } from "./cachingData.service";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { RemoveCommaPipe } from "./remove-comma.pipe";
import { SBRadioButtonComponent } from "./sb-radio-button-list.component";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { SBCheckboxList } from "./sb-checkbox-list.component";
import { GradeDisplayPipe } from "./grade-display.pipe";
import { ColorService } from "./color.service";
import { Angulartics2Module } from 'angulartics2';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DataTableRowExpanderComponent } from "./datatable/datatable-row-expander.component";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    DataTableRowExpanderComponent,
    GradeDisplayPipe,
    PadStartPipe,
    SBRadioButtonComponent,
    SBCheckboxList,
    SchoolYearPipe,
    SearchPipe,
    SubjectPipe,
    RemoveCommaPipe
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    Angulartics2Module.forChild()
  ],
  exports: [
    DataTableRowExpanderComponent,
    GradeDisplayPipe,
    PadStartPipe,
    RemoveCommaPipe,
    RouterModule,
    SBCheckboxList,
    SBRadioButtonComponent,
    SchoolYearPipe,
    SearchPipe,
    SubjectPipe,
    TranslateModule
  ],
  providers: [
    DataService,
    CachingDataService,
    ColorService,
  ]
})
export class CommonModule {
}
