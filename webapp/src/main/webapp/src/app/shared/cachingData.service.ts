import { Injectable } from "@angular/core";
import { Http, RequestOptionsArgs } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class CachingDataService {

  private cache: { [key: string]: any } = {};

  constructor(private http: Http) {
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<any> {
    if(this.cache[url]){
      return Observable.of(this.cache[url]);
    }

    let observable = this.http
      .get(`/api${url}`, options)
      .share()
      .map(response => response.json());

    observable
      .subscribe(x => {
        this.cache[url] = x;
      });

    return observable;
  }

  public getSchoolYears() {
    return this.get("/schoolYears");
  }
}
