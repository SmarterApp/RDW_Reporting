import { Http, Request, RequestOptions, RequestOptionsArgs, Response, XHRBackend } from "@angular/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class AuthenticatedHttpService extends Http {

  constructor(backend: XHRBackend,
              defaultOptions: RequestOptions,
              private service: AuthenticationService) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options)
      .catch(error => {
        if (error.status === 401) {
          this.service.navigateToAuthenticationExpiredRoute();
          return Observable.of();
        }
        return Observable.throw(error);
      });
  }

}
