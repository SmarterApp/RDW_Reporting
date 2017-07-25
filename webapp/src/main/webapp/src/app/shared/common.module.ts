import { NgModule, ErrorHandler } from "@angular/core";
import { PadStartPipe } from "./pad-start.pipe";
import { SubjectPipe } from "./subject.pipe";
import { SchoolYearPipe } from "./schoolYear.pipe";
import { SearchPipe } from "../search.pipe";
import { HttpModule } from "@angular/http";
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
import { Angulartics2Module } from "angulartics2";
import { AuthenticationService } from "./authentication/authentication.service";
import { AlertModule } from "ngx-bootstrap";
import { SessionExpiredComponent } from "./authentication/session-expired.component";
import { StorageService } from "./storage.service";
import { DatePipe, DecimalPipe } from "@angular/common";
import { SBErrorHandler } from "./sb-error-handler.service";
import { ScaleScoreService } from "./scale-score.service";

@NgModule({
  declarations: [
    AssessmentTypePipe,
    GradeDisplayPipe,
    PadStartPipe,
    RemoveCommaPipe,
    SBRadioButtonComponent,
    SBCheckboxList,
    SchoolYearPipe,
    SearchPipe,
    SessionExpiredComponent,
    SubjectPipe
  ],
  imports: [
    AlertModule,
    Angulartics2Module.forChild(),
    BrowserModule,
    FormsModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: RdwTranslateLoader
      }
    })
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
    SessionExpiredComponent,
    SubjectPipe,
    TranslateModule
  ],
  providers: [
    AuthenticationService,
    DataService,
    DatePipe,
    CachingDataService,
    ColorService,
    DecimalPipe,
    ScaleScoreService,
    RdwTranslateLoader,
    StorageService, {
      provide: ErrorHandler,
      useClass: SBErrorHandler
    }
  ]
})
export class CommonModule {
}
