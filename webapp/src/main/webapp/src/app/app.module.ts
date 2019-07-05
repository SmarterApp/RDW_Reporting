import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {
  AlertModule,
  BsDropdownModule,
  ButtonsModule,
  ModalModule,
  PopoverModule,
  TabsModule,
  TypeaheadModule
} from 'ngx-bootstrap';
import { CommonModule } from './shared/common.module';
import { RouteReuseStrategy } from '@angular/router';
import { TranslateResolve } from './translate.resolve';
import { Angulartics2Module } from 'angulartics2';
import { RdwRouteReuseStrategy } from './shared/rdw-route-reuse.strategy';
import { OrganizationExportModule } from './organization-export/organization-export.module';
import { AggregateReportsModule } from './aggregate-report/aggregate-reports.module';
import { AdminModule } from './admin/admin.module';
import { ApplicationSettingsService } from './app-settings.service';
import { ApplicationSettingsResolve } from './app-settings.resolve';
import { DashboardModule } from './dashboard/dashboard.module';
import { HomeModule } from './home/home.module';
import { HttpModule } from '@angular/http';
import { SandboxLoginModule } from './sandbox/sandbox-login.module';
import { ApplicationSecuritySettingService } from './app-security-setting.service';
import { SecuritySettingService } from './shared/security/service/security-settings.service';
import { AppRoutingModule } from './app-routing.module';
import { InlineSVGModule } from 'ng-inline-svg';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AdminModule,
    AggregateReportsModule,
    BrowserModule,
    CommonModule,
    DashboardModule,
    HomeModule,
    HttpModule,
    OrganizationExportModule,
    FormsModule,
    SandboxLoginModule,
    // ngx-bootstrap
    AlertModule.forRoot(),
    Angulartics2Module.forRoot(),
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    InlineSVGModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    TypeaheadModule.forRoot(),
    TabsModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    ApplicationSettingsService,
    ApplicationSettingsResolve,
    TranslateResolve,
    { provide: RouteReuseStrategy, useClass: RdwRouteReuseStrategy },
    {
      provide: SecuritySettingService,
      useClass: ApplicationSecuritySettingService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
