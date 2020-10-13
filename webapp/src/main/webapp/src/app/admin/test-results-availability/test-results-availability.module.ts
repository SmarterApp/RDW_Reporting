import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { translateModuleConfiguration } from '../../shared/translate-module-configuration';
import { RouterModule } from '@angular/router';
import { TestResultsAvailabilityComponent } from './test-results-availability.component';
import { BsDropdownModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { testResultsAvailabilityRoutes } from './test-results-availability.routes';
import { DropdownModule } from 'primeng/dropdown';
import { TestResultsAvailabilityChangeStatusModal } from './test-results-availability-change-status.modal';

@NgModule({
  declarations: [
    TestResultsAvailabilityComponent,
    TestResultsAvailabilityChangeStatusModal
  ],
  entryComponents: [TestResultsAvailabilityChangeStatusModal],
  imports: [
    CommonModule,
    ButtonModule,
    ReportingCommonModule,
    FormsModule,
    ModalModule.forRoot(),
    TableModule,
    TranslateModule.forChild(translateModuleConfiguration),
    RouterModule.forChild(testResultsAvailabilityRoutes),
    BsDropdownModule,
    DropdownModule,
    TooltipModule
  ]
})
export class TestResultsAvailabilityModule {}
