import {
  Http,
  Request,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  XHRBackend
} from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError as _throw } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthenticatedHttpService extends Http {
  constructor(
    backend: XHRBackend,
    defaultOptions: RequestOptions,
    private service: AuthenticationService
  ) {
    super(backend, defaultOptions);
  }

  /**
   * Override the parent method to trap 401s and navigate to an authentication expired page.
   * NOTE: Since this method overrides a 3rd-party method it *must* match the overridden
   * method's signature exactly.  The parent class returns an instance of "rxjs/Observable"
   * which does not include the static methods "of" or "throw" requiring separate imports above.
   *
   * @param {string | Request} url        The request URL
   * @param {RequestOptionsArgs} options  The request options
   * @returns {Observable<Response>}  The response
   */
  request(
    url: string | Request,
    options?: RequestOptionsArgs
  ): Observable<any> {
    return super.request(url, options).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.service.navigateToAuthenticationExpiredRoute();
          return of();
        }
        return _throw(error);
      })
    );
  }
}
