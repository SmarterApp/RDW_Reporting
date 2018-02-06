import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { SpinnerComponent } from "./spinner.component";
import { TranslateModule } from "@ngx-translate/core";
import { SpinnerModal } from "./spinner.modal";

@NgModule({
  declarations: [
    SpinnerComponent,
    SpinnerModal
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    TranslateModule.forRoot()
  ],
  exports: [
    SpinnerComponent,
    SpinnerModal
  ]
})
export class RdwLoadingModule {

}
