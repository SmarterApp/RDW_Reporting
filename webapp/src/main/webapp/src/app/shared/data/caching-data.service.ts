import { Injectable } from "@angular/core";
import { RequestOptionsArgs } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { DataService } from "./data.service";
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { share } from 'rxjs/operators';

@Injectable()
export class CachingDataService {

  private responseByUrl: { [key: string]: any } = {};

  constructor(private dataService: DataService) {
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<any> {

    const previousResponse = this.responseByUrl[ url ];
    if (previousResponse) {
      return of(previousResponse);
    }

    const observable = this.dataService
      .get(url, options)
      .pipe(
        share()
      );

    observable.subscribe(
      response => {
        this.responseByUrl[ url ] = response;
      },
      error => _throw(error)
    );

    return observable;
  }

}
