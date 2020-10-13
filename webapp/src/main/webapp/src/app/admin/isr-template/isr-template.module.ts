import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { IsrTemplateComponent } from './isr-template.component';
import { translateModuleConfiguration } from '../../shared/translate-module-configuration';
import { isrTemplateRoutes } from './isr-template.routes';
import { ModalModule, TooltipModule } from 'ngx-bootstrap';
import { ButtonModule } from 'primeng/button';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { IsrTemplateService } from './service/isr-template.service';
import { IsrTemplateDeleteModal } from './isr-template-delete.modal';
import { FileUploadModule } from 'ng2-file-upload';
import { IsrTemplateSandboxModal } from './isr-template-sandbox.modal';

@NgModule({
  declarations: [
    IsrTemplateDeleteModal,
    IsrTemplateComponent,
    IsrTemplateSandboxModal
  ],
  entryComponents: [IsrTemplateDeleteModal, IsrTemplateSandboxModal],
  imports: [
    ButtonModule,
    CommonModule,
    FileUploadModule,
    FormsModule,
    ModalModule.forRoot(),
    ReportingCommonModule,
    RouterModule.forChild(isrTemplateRoutes),
    TableModule,
    TranslateModule.forChild(translateModuleConfiguration),
    TooltipModule
  ],
  providers: [IsrTemplateService]
})
export class IsrTemplateModule {}
