import { NgModule } from "@angular/core";
import { SBIconComponent } from "./sb-icon.component";
import { InlineSVGModule } from "ng-inline-svg";
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
  declarations: [
    SBIconComponent
  ],
  imports: [
    BrowserModule,
    InlineSVGModule.forRoot()
  ],
  exports: [
    SBIconComponent
  ]
})
export class RdwIconModule {
}
