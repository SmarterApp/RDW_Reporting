import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { TranslateLoader } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";
import { EmbeddedLanguages } from "./language-settings";
import { HttpClient } from "@angular/common/http";
import { forkJoin } from 'rxjs/observable/forkJoin';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

const EmptyObservable = of({});

@Injectable()
export class RdwTranslateLoader implements TranslateLoader {

  private clientTranslationsLoader;
  private serverTranslationsLoader;

  constructor(http: HttpClient) {
    this.clientTranslationsLoader = new TranslateHttpLoader(http, '/assets/i18n/', '.json');
    this.serverTranslationsLoader = new TranslateHttpLoader(http, '/api/translations/', '');
  }

  getTranslation(languageCode: string): Observable<any> {
    return forkJoin(
      this.getClientTranslations(languageCode),
      this.getServerTranslations(languageCode)
    ).pipe(
      map(([ clientTranslations, serverTranslations ]) => {
        return _.merge(clientTranslations, serverTranslations);
      })
    );
  };

  private getClientTranslations(languageCode: string): Observable<any> {
    return EmbeddedLanguages.indexOf(languageCode) != -1
      ? this.clientTranslationsLoader.getTranslation(languageCode)
      : EmptyObservable;
  }

  private getServerTranslations(languageCode: string): Observable<any> {
    return this.serverTranslationsLoader.getTranslation(languageCode)
      .pipe(
        catchError(() => EmptyObservable)
      );
  }

}
