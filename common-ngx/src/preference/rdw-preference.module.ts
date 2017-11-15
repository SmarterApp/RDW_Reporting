import { NgModule } from "@angular/core";
import { UserPreferenceService } from "./user-preference.service";
import { RdwCoreModule } from "../core/rdw-core.module";
import { CookieService } from "angular2-cookie/services/cookies.service";

@NgModule({
  imports: [
    RdwCoreModule
  ],
  providers: [
    UserPreferenceService,
    { provide: CookieService, useFactory: cookieServiceFactory }
  ]
})
export class RdwPreferenceModule {
}

export function cookieServiceFactory() {
  return new CookieService();
}
