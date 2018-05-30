import { NgModule } from "@angular/core";
import { SBIconComponent } from "./sb-icon.component";
import { InlineSVGModule } from 'ng-inline-svg';

@NgModule({
  declarations: [
    SBIconComponent
  ],
  imports: [
    InlineSVGModule
  ],
  exports: [
    SBIconComponent
  ]
})
export class RdwIconModule {
}
