import { NgModule } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MockRouter } from "./mock.router";
import { MockActivatedRoute } from "./mock.activated-route";
import { MockTranslateService } from "./mock.translate.service";
import { TranslateService } from "@ngx-translate/core";
import { MockAuthorizeDirective } from "./mock.authorize.directive";

@NgModule({
  declarations: [
    MockAuthorizeDirective
  ],
  exports: [
    MockAuthorizeDirective
  ],
  providers: [
    { provide: ActivatedRoute, useClass: MockActivatedRoute },
    { provide: Router, useClass: MockRouter },
    { provide: TranslateService, useClass: MockTranslateService }
  ]
})
export class TestModule {
}
