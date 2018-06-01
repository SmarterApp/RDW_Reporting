import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SBRadioButtonComponent } from './sb-radio-button-list.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SBCheckboxList } from './sb-checkbox-list.component';
import { ColorService } from './color.service';
import { Angulartics2Module } from 'angulartics2';
import { NotificationComponent } from './notification/notification.component';
import { NotificationService } from './notification/notification.service';
import { AlertModule, PopoverModule } from 'ngx-bootstrap';
import { RdwLoadingModule } from './loading/rdw-loading.module';
import { SBToggleComponent } from './sb-toggle.component';
import { ScaleScoreComponent } from './scale-score/scale-score.component';
import { RdwDataTableModule } from './datatable/rdw-datatable.module';
import { RdwCoreModule } from './core/rdw-core.module';
import { RdwFormModule } from './form/rdw-form.module';
import { RdwDataModule } from './data/rdw-data.module';
import { RdwFormatModule } from './format/rdw-format.module';
import { RdwI18nModule } from './i18n/rdw-i18n.module';
import { RdwLayoutModule } from './layout/rdw-layout.module';
import { RdwMenuModule } from './menu/rdw-menu.module';
import { RdwPreferenceModule } from './preference/rdw-preference.module';
import { RdwSecurityModule } from './security/rdw-security.module';
import { RdwTranslateLoader } from './i18n/rdw-translate-loader';
import {
  AuthenticationServiceAuthenticationExpiredRoute,
  AuthenticationServiceDefaultAuthenticationRoute
} from './security/authentication.service';
import { OrganizationModule } from './organization/organization.module';
import { ScrollNavComponent } from './nav/scroll-nav.component';
import { OptionalPipe } from './optional.pipe';
import { RdwDisplayOptionsModule } from './display-options/rdw-display-options.module';
import { RdwAssessmentModule } from './assessment/rdw-assessment.module';
import { OrderSelectorComponent } from './order-selector/order-selector.component';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { CommonEmbargoModule } from './embargo/embargo.module';
import { SchoolModule } from './school/school.module';
import { InViewDirective } from './nav/in-view.directive';
import { RdwListModule } from './list/rdw-list.module';
import { RdwFilterModule } from './filter/rdw-filter.module';
import { RdwIconModule } from "./icon/rdw-icon.module";


@NgModule({
  declarations: [
    OptionalPipe,
    OrderSelectorComponent,
    ScrollNavComponent,
    NotificationComponent,
    SBCheckboxList,
    SBRadioButtonComponent,
    SBToggleComponent,
    ScaleScoreComponent,
    InViewDirective
  ],
  imports: [
    AlertModule,
    Angulartics2Module.forChild(),
    BrowserModule,
    CommonEmbargoModule,
    FormsModule,
    HttpModule,
    NgxDnDModule,
    OrganizationModule,
    SchoolModule,
    PopoverModule.forRoot(),
    RdwAssessmentModule,
    RdwCoreModule,
    RdwDataModule.forRoot(),
    RdwDataTableModule,
    RdwDisplayOptionsModule,
    RdwFilterModule,
    RdwFormModule,
    RdwFormatModule,
    RdwI18nModule,
    RdwIconModule,
    RdwLayoutModule,
    RdwListModule,
    RdwLoadingModule,
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
    CommonEmbargoModule,
    OptionalPipe,
    OrderSelectorComponent,
    NotificationComponent,
    ScrollNavComponent,
    OrganizationModule,
    SchoolModule,
    RouterModule,
    RdwAssessmentModule,
    RdwCoreModule,
    RdwDataTableModule,
    RdwDisplayOptionsModule,
    RdwFilterModule,
    RdwFormModule,
    RdwFormatModule,
    RdwI18nModule,
    RdwIconModule,
    RdwLayoutModule,
    RdwListModule,
    RdwLoadingModule,
    RdwPreferenceModule,
    RdwSecurityModule,
    SBCheckboxList,
    SBRadioButtonComponent,
    SBToggleComponent,
    ScaleScoreComponent,
    TranslateModule,
    InViewDirective,

  ],
  providers: [
    { provide: AuthenticationServiceAuthenticationExpiredRoute, useValue: 'session-expired' },
    { provide: AuthenticationServiceDefaultAuthenticationRoute, useValue: 'home' },
    ColorService,
    NotificationService
  ]
})
export class CommonModule {
}
