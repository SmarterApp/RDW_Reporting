import { RdwCoreModule } from '../core/rdw-core.module';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { AccessDeniedComponent } from './component/access-denied/access-denied.component';
import { SessionExpiredComponent } from './component/session-expired/session-expired.component';
import { AuthorizationDirective } from './directive/authorization.directive';
import { AuthenticatedHttpService } from './service/authenticated-http.service';
import { SecuritySettingService } from './service/security-settings.service';
import { DefaultSecuritySettingsService } from './service/default-security-settings.service';
import { NotAuthenticatedHttpInterceptor } from './service/not-authenticated.http-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/**
 * Common security module.
 *
 * When imported, please override the PermissionService with a custom permission provider.
 * Example: { provide: PermissionService, useClass: MyPermissionService }
 *
 * Also, you may optionally, override the AccessDeniedRoute (defaultValue: 'access-denied')
 * Example: { provide: AccessDeniedRoute, useValue: 'my-access-denied-route' }
 */
@NgModule({
  imports: [
    CommonModule,
    RdwCoreModule,
    // These can be overridden in the consuming apps
    RouterModule,
    TranslateModule
  ],
  declarations: [
    AccessDeniedComponent,
    SessionExpiredComponent,
    AuthorizationDirective
  ],
  exports: [
    AccessDeniedComponent,
    SessionExpiredComponent,
    AuthorizationDirective
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: Http, useClass: AuthenticatedHttpService },
    {
      provide: SecuritySettingService,
      useClass: DefaultSecuritySettingsService
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotAuthenticatedHttpInterceptor,
      multi: true
    }
  ]
})
export class RdwSecurityModule {}
