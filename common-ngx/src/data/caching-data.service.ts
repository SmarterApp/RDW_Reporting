import { Injectable } from "@angular/core";
import { RequestOptionsArgs } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { DataService } from "./data.service";

@Injectable()
export class CachingDataService {

  private responseByUrl: { [key: string]: any } = {};

  constructor(private dataService: DataService) {
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<any> {

    let previousResponse = this.responseByUrl[ url ];
    if (previousResponse) {
      return Observable.of(previousResponse);
    }

    let observable = this.dataService
      .get(url, options)
      .share();

    observable.subscribe(
      response => {
        this.responseByUrl[ url ] = response;
      },
      error => Observable.throw(error)
    );

    return observable;
  }

}
