import { HttpModule } from "@angular/http";
import { NgModule } from "@angular/core";
import { RdwTranslateLoader } from "./rdw-translate-loader";
import { LanguageStore } from "./language.store";
import { LanguageSelect } from "./language-select.component";
import { RdwPreferenceModule } from "../preference/rdw-preference.module";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { TranslateDatePipe } from "./translate-date.pipe";
import { TranslateNumberPipe } from "./translate-number.pipe";

@NgModule({
  declarations: [
    LanguageSelect,
    TranslateDatePipe,
    TranslateNumberPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    RdwPreferenceModule,
    // These can be overridden in the consuming apps
    RouterModule.forRoot([]),
    TranslateModule.forRoot()
  ],
  exports: [
    BrowserModule,
    LanguageSelect,
    TranslateDatePipe,
    TranslateNumberPipe
  ],
  providers: [
    RdwTranslateLoader,
    LanguageStore,
    TranslateDatePipe,
    TranslateNumberPipe
  ]
})
export class RdwI18nModule {
}
