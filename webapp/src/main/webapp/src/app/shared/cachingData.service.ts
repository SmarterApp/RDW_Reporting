import { Injectable } from "@angular/core";
import { RequestOptionsArgs } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { DataService } from "./data/data.service";

@Injectable()
export class CachingDataService {

  private cache: { [key: string]: any } = {};

  constructor(private dataService: DataService) {
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<any> {
    if(this.cache[url]){
      return Observable.of(this.cache[url]);
    }

    let observable = this.dataService
      .get(url, options)
      .share();

    observable
      .subscribe(x => {
        this.cache[url] = x;
      });

    return observable;
  }
}
