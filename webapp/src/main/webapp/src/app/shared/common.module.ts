import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SBRadioButtonComponent } from './sb-radio-button-list.component';
import { FormsModule } from '@angular/forms';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { SBCheckboxList } from './sb-checkbox-list.component';
import { Angulartics2Module } from 'angulartics2';
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
import { RdwIconModule } from './icon/rdw-icon.module';
import { TargetService } from './target/target.service';
import { DataTableService } from './datatable/datatable-service';
import { SubjectModule } from '../subject/subject.module';
import { OrderingService } from './ordering/ordering.service';
import { RdwNotificationsModule } from './notification/notifications.module';
import { InstructionalResourcePopoverComponent } from './component/instructional-resource-popover/instructional-resource-popover.component';
import { ConfirmationModalComponent } from './component/confirmation-modal/confirmation-modal.component';
import { ErrorComponent } from './component/error/error.component';

@NgModule({
  imports: [
    AlertModule,
    Angulartics2Module.forRoot(),
    AngularCommonModule,
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
    RdwNotificationsModule,
    RdwPreferenceModule,
    RdwSecurityModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: RdwTranslateLoader
      }
    }),
    SubjectModule
  ],
  declarations: [
    ConfirmationModalComponent,
    ErrorComponent,
    OptionalPipe,
    OrderSelectorComponent,
    ScrollNavComponent,
    SBCheckboxList,
    SBRadioButtonComponent,
    SBToggleComponent,
    ScaleScoreComponent,
    InViewDirective,
    InstructionalResourcePopoverComponent
  ],
  entryComponents: [ConfirmationModalComponent],
  exports: [
    CommonEmbargoModule,
    ConfirmationModalComponent,
    ErrorComponent,
    OptionalPipe,
    OrderSelectorComponent,
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
    RdwNotificationsModule,
    RdwPreferenceModule,
    RdwSecurityModule,
    SBCheckboxList,
    SBRadioButtonComponent,
    SBToggleComponent,
    ScaleScoreComponent,
    TranslateModule,
    InViewDirective,
    InstructionalResourcePopoverComponent,
    SubjectModule
  ],
  providers: [DataTableService, OrderingService, TargetService]
})
export class CommonModule {}
