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
import { ScaleScoreComponent } from "./scale-score/scale-score.component";
import { RdwDataTableModule } from "./datatable/rdw-datatable.module";
import { RdwCoreModule } from "./core/rdw-core.module";
import { RdwFormModule } from "./form/rdw-form.module";
import { RdwDataModule } from "./data/rdw-data.module";
import { RdwFormatModule } from "./format/rdw-format.module";
import { RdwI18nModule } from "./i18n/rdw-i18n.module";
import { RdwLayoutModule } from "./layout/rdw-layout.module";
import { RdwMenuModule } from "./menu/rdw-menu.module";
import { RdwPreferenceModule } from "./preference/rdw-preference.module";
import { RdwSecurityModule } from "./security/rdw-security.module";
import { RdwTranslateLoader } from "./i18n/rdw-translate-loader";
import {
  AuthenticationServiceAuthenticationExpiredRoute,
  AuthenticationServiceDefaultAuthenticationRoute
} from "./security/authentication.service";
import { OrganizationModule } from "./organization/organization.module";
import { ScrollNavComponent } from "./nav/scroll-nav.component";


@NgModule({
  declarations: [
    AssessmentTypePipe,
    GradeDisplayPipe,
    InformationButtonComponent,
    LoaderComponent,
    ScrollNavComponent,
    NotificationComponent,
    RemoveCommaPipe,
    SBCheckboxList,
    SBRadioButtonComponent,
    SBToggleComponent,
    ScaleScoreComponent
  ],
  imports: [
    AlertModule,
    Angulartics2Module.forChild(),
    BrowserModule,
    FormsModule,
    HttpModule,
    OrganizationModule,
    PopoverModule.forRoot(),
    RdwCoreModule,
    RdwDataModule.forRoot(),
    RdwDataTableModule,
    RdwFormModule,
    RdwFormatModule,
    RdwI18nModule,
    RdwLayoutModule,
    RdwMenuModule,
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
    LoaderComponent,
    NotificationComponent,
    ScrollNavComponent,
    OrganizationModule,
    RemoveCommaPipe,
    RouterModule,
    RdwCoreModule,
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
    ScaleScoreComponent,
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
