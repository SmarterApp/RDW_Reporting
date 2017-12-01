import { NgModule } from "@angular/core";
import { Breadcrumbs } from "./breadcrumbs.component";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    Breadcrumbs
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([]),
    TranslateModule.forRoot()
  ],
  exports: [
    Breadcrumbs
  ]
})
export class RdwLayoutModule {
}
