import { Injectable } from "@angular/core";
import { Http, RequestOptionsArgs } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class DataService {

  constructor(private http: Http) {
  }

  get(url, options?: RequestOptionsArgs): Observable<any> {
    return this.http
      .get(`/api${url}`, options)
      .map(response => response.json());
  }

  delete(url, options?: RequestOptionsArgs): Observable<any> {
    return this.http
      .delete(`/api${url}`, options)
      .map(response => response.json());
  }
}
