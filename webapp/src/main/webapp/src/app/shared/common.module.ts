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
import { RdwTranslateLoader } from "./rdw-translate-loader";
import { AssessmentTypePipe } from "./assessment-type.pipe";
import { ColorService } from "./color.service";
import { Angulartics2Module } from 'angulartics2';

@NgModule({
  declarations: [
    AssessmentTypePipe,
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
        useClass: RdwTranslateLoader
      }
    }),
    Angulartics2Module.forChild()
  ],
  exports: [
    AssessmentTypePipe,
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
    RdwTranslateLoader
  ]
})
export class CommonModule {
}
