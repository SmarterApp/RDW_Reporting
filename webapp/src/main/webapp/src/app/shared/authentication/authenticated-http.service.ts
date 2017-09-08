import { XHRBackend, RequestOptions, Request, RequestOptionsArgs, Http, Response } from "@angular/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
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
      .catch((error: Response) => {
        if (error.status === 401) {
          this.service.handleAuthenticationFailure();
          return Observable.of();
        }
        return Observable.throw(error);
      });
  }
}
