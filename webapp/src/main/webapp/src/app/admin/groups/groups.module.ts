import { NgModule } from '@angular/core';
import { GroupsComponent } from './groups.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { DropdownModule } from 'primeng/primeng';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { translateModuleConfiguration } from '../../shared/translate-module-configuration';
import { RouterModule } from '@angular/router';
import { groupRoutes } from './groups.routes';
import { GroupImportModule } from './import/group-import.module';
import { FileFormatModule } from './import/fileformat/file-format.module';

@NgModule({
  imports: [
    CommonModule,
    ReportingCommonModule,
    DropdownModule,
    FormsModule,
    ModalModule,
    TableModule,
    GroupImportModule,
    FileFormatModule,
    TranslateModule.forChild(translateModuleConfiguration),
    RouterModule.forChild(groupRoutes)
  ],
  declarations: [GroupsComponent]
})
export class GroupsModule {}
