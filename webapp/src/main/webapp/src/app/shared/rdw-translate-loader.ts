import { Observable } from "rxjs";
import { JsonUnFlat } from "json-unflat";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Http } from "@angular/http";
import * as _ from "lodash";

export class RdwTranslateLoader {
  constructor(private http: Http){
  }

  private apiLoader = new TranslateHttpLoader(this.http, '/api/translations/', '');
  private uiLoader = new TranslateHttpLoader(this.http, '/assets/i18n/', '.json');

  getTranslation(lang: string) {
    return this.uiLoader
      .getTranslation(lang)
      .mergeMap(uiTranslation => this.apiLoader
        .getTranslation(lang)
        .mergeMap(apiTranslation => {
          // TODO: Should the API unflatten the JSON before returning?
          let merged = _.merge(uiTranslation, JsonUnFlat.unflat(apiTranslation));
          return Observable.of(merged);
        }));
  };
}
