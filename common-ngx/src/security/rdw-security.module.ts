import { BrowserModule } from "@angular/platform-browser";
import { RdwCoreModule } from "../core/rdw-core.module";
import { NgModule } from "@angular/core";
import { AuthenticationService } from "./authentication.service";
import { Http } from "@angular/http";
import { RouterModule } from "@angular/router";
import { AuthenticatedHttpService } from "./authenticated-http.service";
import { TranslateModule } from "@ngx-translate/core";
import { SessionExpiredComponent } from "./session-expired.component";
import { APP_BASE_HREF } from "@angular/common";
import { AuthorizationService } from "./authorization.service";
import { AuthorizationDirective } from "./authorization.directive";
import { PermissionService } from "./permission.service";
import { AccessDeniedRoute, RoutingAuthorizationCanActivate } from "./routing-authorization.can-activate";
import { AuthorizationCanActivate } from "./authorization.can-activate";

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
  declarations: [
    SessionExpiredComponent,
    AuthorizationDirective
  ],
  imports: [
    BrowserModule,
    RdwCoreModule,
    // These can be overridden in the consuming apps
    RouterModule.forRoot([]),
    TranslateModule.forRoot()
  ],
  exports: [
    SessionExpiredComponent,
    AuthorizationDirective
  ],
  providers: [
    { provide: Http, useClass: AuthenticatedHttpService },
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: AccessDeniedRoute, useValue: 'access-denied' },
    AuthenticationService,
    AuthorizationService,
    AuthorizationCanActivate,
    RoutingAuthorizationCanActivate,
    PermissionService
  ]
})
export class RdwSecurityModule {
}
