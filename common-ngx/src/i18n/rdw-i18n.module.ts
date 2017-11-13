import { HttpModule } from "@angular/http";
import { NgModule } from "@angular/core";
import { RdwTranslateLoader } from "./rdw-translate-loader";

@NgModule({
  declarations: [],
  imports: [
    HttpModule
  ],
  providers: [
    RdwTranslateLoader
  ]
})
export class RdwI18nModule {
}
