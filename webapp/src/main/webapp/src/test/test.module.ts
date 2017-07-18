import { NgModule } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MockRouter } from "./mock.router";
import { MockActivatedRoute } from "./mock.activated-route";

@NgModule({
  providers: [
    { provide: ActivatedRoute, useClass: MockActivatedRoute } ,
    { provide: Router, useClass: MockRouter }
  ]
})
export class TestModule {
}
