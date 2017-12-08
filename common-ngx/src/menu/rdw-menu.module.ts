import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RdwI18nModule } from "../i18n/rdw-i18n.module";
import { PopoverModule } from "ngx-bootstrap";
import { PopupMenuComponent } from "./popup-menu.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    PopupMenuComponent
  ],
  imports: [
    BrowserModule,
    PopoverModule.forRoot(),
    RdwI18nModule,
    TranslateModule.forRoot()
  ],
  exports: [
    PopupMenuComponent
  ]
})
export class RdwMenuModule {
}
