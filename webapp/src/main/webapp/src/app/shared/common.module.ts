import { NgModule } from "@angular/core";
import { PadStartPipe } from "./pad-start.pipe";
import { SubjectPipe } from "./subject.pipe";
import { SchoolYearPipe } from "./schoolYear.pipe";
import { SearchPipe } from "../search.pipe";
import { HttpModule, Http } from "@angular/http";
import { DataService } from "./data.service";
import { CachingDataService } from "./cachingData.service";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { RouterModule } from "@angular/router";
import { RemoveCommaPipe } from "./remove-comma.pipe";

export function createTranslateLoader(http: Http) {
  // return new TranslateHttpLoader(http, '/api/translations/', '');
  // until api implementation is complete, use local .json
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    PadStartPipe,
    SubjectPipe,
    SchoolYearPipe,
    SearchPipe,
    RemoveCommaPipe
  ],
  imports: [
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [ Http ]
      }
    })
  ],
  exports: [
    PadStartPipe,
    RemoveCommaPipe,
    SubjectPipe,
    SchoolYearPipe,
    SearchPipe,
    TranslateModule,
    RouterModule
  ],
  providers: [
    DataService,
    CachingDataService
  ]
})
export class CommonModule {
}
