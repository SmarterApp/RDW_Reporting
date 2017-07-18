import { Injectable } from "@angular/core";
import { Http, RequestOptionsArgs, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { AuthenticationService } from "../authentication.service";

//TODO: Break out methods from DataService so only a public generic Get.
//TODO: Other methods such as getGroups belong in their own service such as GroupService
@Injectable()
export class DataService {

  constructor(private http: Http,
              private authenticationService: AuthenticationService) {
  }

  get(url, options?: RequestOptionsArgs): Observable<any> {
    return this.http
      .get(`/api${url}`, options)
      .catch((response: Response) => {
        if (response.status === 401) {
          this.authenticationService.handleAuthenticationFailure();
        }
        return Observable.throw(response);
      })
      .map(response => response.json());
  }

  getGroups(): Observable<Array<any>> {
    return this.get(`/groups`);
  }
}
