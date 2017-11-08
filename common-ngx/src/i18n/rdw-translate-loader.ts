import { JsonUnFlat } from "json-unflat";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Http } from "@angular/http";
import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { TranslateLoader } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

@Injectable()
export class RdwTranslateLoader implements TranslateLoader {

  private embeddedLanguages: string[] = ["en"];

  constructor(private http: Http) {
  }

  private apiLoader = new TranslateHttpLoader(this.http, '/api/translations/', '');
  private uiLoader = new TranslateHttpLoader(this.http, '/assets/i18n/', '.json');

  getTranslation(lang: string): Observable<any> {
    let uiObservable = this.embeddedLanguages.indexOf(lang) >= 0 ?
        this.uiLoader.getTranslation(lang) : Observable.of({});

    let apiObservable = this.apiLoader.getTranslation(lang).catch(() => Observable.of({}));

    let translateObserver: Observer<any>;
    let observable = new Observable<any>(observer => translateObserver = observer);

    Observable
      .forkJoin([ uiObservable, apiObservable ])
      .share()
      .subscribe(responses => {
        let merged = _.merge(responses[ 0 ], JsonUnFlat.unflat(responses[ 1 ]));
        translateObserver.next(merged);
        translateObserver.complete();
      });

    return observable;
  };
}
