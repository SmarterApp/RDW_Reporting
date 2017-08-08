import { Observable, Observer } from "rxjs";
import { JsonUnFlat } from "json-unflat";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Http } from "@angular/http";
import * as _ from "lodash";
import { Injectable } from "@angular/core";

@Injectable()
export class RdwTranslateLoader {
  /**
   * @returns The observable for the getTranslation request.
   */
  public get observable() {
    return this._observable;
  };

  constructor(private http: Http) {
  }

  private apiLoader = new TranslateHttpLoader(this.http, '/api/translations/', '');
  private uiLoader = new TranslateHttpLoader(this.http, '/assets/i18n/', '.json');
  private _observable: Observable<any>;

  getTranslation(lang: string) {
    let uiObservable = this.uiLoader.getTranslation(lang);
    let apiObservable = this.apiLoader.getTranslation(lang).catch(res => Observable.of({}));

    let translateObserver: Observer<any>;
    this._observable = new Observable<any>(observer => translateObserver = observer).share();

    Observable
      .forkJoin([uiObservable, apiObservable])
      .share()
      .subscribe(responses => {
        let merged = _.merge(responses[0], JsonUnFlat.unflat(responses[1]));
        translateObserver.next(merged);
        translateObserver.complete();
      });

    return this._observable;
  };
}
