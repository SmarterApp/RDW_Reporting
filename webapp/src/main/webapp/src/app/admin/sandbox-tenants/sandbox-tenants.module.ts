import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SandboxConfigurationComponent } from './pages/sandbox.component';
import { SandboxConfigurationDetailsComponent } from './component/sandbox-details.component';
import { ButtonsModule, ModalModule, PopoverModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '../../shared/common.module';
import { SandboxService } from './service/sandbox.service';
import { NewSandboxConfigurationComponent } from './pages/new-sandbox.component';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { AccordionModule, TreeTableModule } from 'primeng/primeng';
import { DeleteSandboxConfigurationModalComponent } from './modal/delete-sandbox.modal';
import { DeleteTenantConfigurationModalComponent } from './modal/delete-tenant.modal';
import { ArchiveSandboxConfigurationModalComponent } from './modal/archive-sandbox.modal';
import { ResetDataModalComponent } from './modal/reset-data.modal';
import { PropertyOverrideTableComponent } from './component/property-override-table.component';
import { TenantService } from './service/tenant.service';
import { NewTenantConfigurationComponent } from './pages/new-tenant.component';
import { TenantConfigurationComponent } from './pages/tenant.component';
import { TenantConfigurationDetailsComponent } from './component/tenant-details.component';
import { PropertyOverrideTreeTableComponent } from './component/property-override-tree-table.component';
import { TenantStore } from './store/tenant.store';
import { SandboxStore } from './store/sandbox.store';

@NgModule({
  declarations: [
    SandboxConfigurationComponent,
    SandboxConfigurationDetailsComponent,
    NewSandboxConfigurationComponent,
    NewTenantConfigurationComponent,
    TenantConfigurationComponent,
    TenantConfigurationDetailsComponent,
    DeleteSandboxConfigurationModalComponent,
    DeleteTenantConfigurationModalComponent,
    ArchiveSandboxConfigurationModalComponent,
    PropertyOverrideTableComponent,
    PropertyOverrideTreeTableComponent,
    ResetDataModalComponent
  ],
  entryComponents: [
    DeleteSandboxConfigurationModalComponent,
    DeleteTenantConfigurationModalComponent,
    ArchiveSandboxConfigurationModalComponent,
    ResetDataModalComponent
  ],
  imports: [
    BrowserModule,
    ButtonsModule.forRoot(),
    CommonModule,
    FormsModule,
    MenuModule,
    AccordionModule,
    ReactiveFormsModule,
    HttpClientModule,
    TableModule,
    TreeTableModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot()
  ],
  exports: [
    SandboxConfigurationComponent,
    NewSandboxConfigurationComponent,
    TenantConfigurationComponent,
    NewTenantConfigurationComponent
  ],
  providers: [SandboxService, TenantService, TenantStore, SandboxStore]
})
export class SandboxTenantsModule {}
