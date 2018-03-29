import { Injectable } from "@angular/core";
import { RequestOptionsArgs } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { DataService } from "./data.service";
import { share, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

/**
 * Caches HTTP get responses and makes sure that concurrent requests
 * for the same resource not produce duplicate network calls
 */
@Injectable()
export class CachingDataService {

  /**
   * The in-progress http requests indexed by URL
   *
   * @type {Map<any, any>}
   */
  private requestsByUrl: Map<string, Observable<any>> = new Map();

  /**
   * The http responses indexed by URL
   *
   * @type {Map<any, any>}
   */
  private responsesByUrl: Map<string, any> = new Map();

  constructor(private dataService: DataService) {
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<any> {

    const cacheKey = this.createKey(url, options);

    const response = this.responsesByUrl.get(cacheKey);
    if (response) {
      return of(response);
    }

    const request = this.requestsByUrl.get(cacheKey);
    if (request) {
      return request;
    }

    const observable = this.dataService.get(url, options).pipe(
      tap(value => {
        this.responsesByUrl.set(cacheKey, value);
        this.requestsByUrl.delete(cacheKey);
      }),
      share()
    );

    this.requestsByUrl.set(cacheKey, observable);
    return observable;
  }

  private createKey(url: string, options?: RequestOptionsArgs): string {
    if (options == null) {
      return url;
    }
    const parameters = options.params || options.search || {};
    return url + '?' + Object.entries(parameters)
      .sort(([ a ], [ b ]) => a.localeCompare(b))
      .map(([ key, value ]) => key + '=' + value)
      .join('&');
  }

}

