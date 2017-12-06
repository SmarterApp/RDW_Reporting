import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { RemoveCommaPipe } from "./remove-comma.pipe";
import { SBRadioButtonComponent } from "./sb-radio-button-list.component";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { SBCheckboxList } from "./sb-checkbox-list.component";
import { GradeDisplayPipe } from "./grade-display.pipe";
import { AssessmentTypePipe } from "./assessment-type.pipe";
import { ColorService } from "./color.service";
import { Angulartics2Module } from "angulartics2";
import { NotificationComponent } from "./notification/notification.component";
import { NotificationService } from "./notification/notification.service";
import { AlertModule, PopoverModule } from "ngx-bootstrap";
import { DatePipe, DecimalPipe } from "@angular/common";
import { LoaderComponent } from "./loader/loader.component";
import { SBToggleComponent } from "./sb-toggle.component";
import { InformationButtonComponent } from "./button/information-button.component";
import {
  AuthenticationServiceAuthenticationExpiredRoute,
  AuthenticationServiceDefaultAuthenticationRoute,
  RdwCoreModule,
  RdwDataModule,
  RdwDataTableModule,
  RdwFormatModule,
  RdwFormModule,
  RdwI18nModule,
  RdwPreferenceModule,
  RdwSecurityModule,
  RdwTranslateLoader,
} from "@sbac/rdw-reporting-common-ngx";
import { RdwLayoutModule } from "@sbac/rdw-reporting-common-ngx";
import { ButtonComponent } from "./button/button.component";
import { BookButtonComponent } from "./button/book-button.component";


@NgModule({
  declarations: [
    AssessmentTypePipe,
    GradeDisplayPipe,
    InformationButtonComponent,
    BookButtonComponent,
    ButtonComponent,
    LoaderComponent,
    NotificationComponent,
    RemoveCommaPipe,
    SBCheckboxList,
    SBRadioButtonComponent,
    SBToggleComponent
  ],
  imports: [
    AlertModule,
    Angulartics2Module.forChild(),
    BrowserModule,
    FormsModule,
    HttpModule,
    PopoverModule.forRoot(),
    RdwCoreModule,
    RdwDataModule.forRoot(),
    RdwDataTableModule,
    RdwFormModule,
    RdwFormatModule,
    RdwI18nModule,
    RdwLayoutModule,
    RdwPreferenceModule,
    RdwSecurityModule,
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
    InformationButtonComponent,
    BookButtonComponent,
    ButtonComponent,
    LoaderComponent,
    NotificationComponent,
    RemoveCommaPipe,
    RouterModule,
    RdwDataTableModule,
    RdwFormModule,
    RdwFormatModule,
    RdwI18nModule,
    RdwLayoutModule,
    RdwPreferenceModule,
    RdwSecurityModule,
    SBCheckboxList,
    SBRadioButtonComponent,
    SBToggleComponent,
    TranslateModule
  ],
  providers: [
    { provide: AuthenticationServiceAuthenticationExpiredRoute, useValue: 'session-expired' },
    { provide: AuthenticationServiceDefaultAuthenticationRoute, useValue: 'home' },
    ColorService,
    DatePipe,
    DecimalPipe,
    NotificationService
  ]
})
export class CommonModule {
}
