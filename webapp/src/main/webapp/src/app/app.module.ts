import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AlertModule, BsDropdownModule, PopoverModule, TabsModule } from 'ngx-bootstrap';
import { CommonModule } from './shared/common.module';
import { UserModule } from './user/user.module';
import { routes } from './app.routes';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { TranslateResolve } from './translate.resolve';
import { Angulartics2GoogleAnalytics, Angulartics2Module } from 'angulartics2';
import { RdwRouteReuseStrategy } from './shared/rdw-route-reuse.strategy';
import { ErrorComponent } from './error/error.component';
import { AccessDeniedComponent } from './error/access-denied/access-denied.component';
import { OrganizationExportModule } from './organization-export/organization-export.module';
import { AggregateReportsModule } from './aggregate-report/aggregate-reports.module';
import { AdminModule } from './admin/admin.module';
import { ApplicationSettingsService } from './app-settings.service';
import { ApplicationSettingsResolve } from './app-settings.resolve';
import { DashboardModule } from './dashboard/dashboard.module';
import { HomeModule } from './home/home.module';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    AccessDeniedComponent
  ],
  imports: [
    AdminModule,
    AggregateReportsModule,
    AlertModule.forRoot(),
    BrowserModule,
    CommonModule,
    DashboardModule,
    HomeModule,
    HttpModule,
    OrganizationExportModule,
    RouterModule.forRoot(routes),
    UserModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ])
  ],
  providers: [
    ApplicationSettingsService,
    ApplicationSettingsResolve,
    TranslateResolve,
    { provide: RouteReuseStrategy, useClass: RdwRouteReuseStrategy }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
