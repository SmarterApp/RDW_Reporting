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

@NgModule({
  declarations: [
    SessionExpiredComponent
  ],
  imports: [
    BrowserModule,
    RdwCoreModule,
    // These can be overriden in the consuming apps
    RouterModule.forRoot([]),
    TranslateModule.forRoot()
  ],
  exports: [
    SessionExpiredComponent
  ],
  providers: [
    { provide: Http, useClass: AuthenticatedHttpService },
    AuthenticationService,
    {provide: APP_BASE_HREF, useValue : '/' }
  ]
})
export class RdwSecurityModule {
}
