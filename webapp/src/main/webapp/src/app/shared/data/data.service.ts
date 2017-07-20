import { Injectable } from "@angular/core";
import { Http, RequestOptionsArgs, Response, ResponseContentType } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { AuthenticationService } from "../authentication/authentication.service";
import { Download } from "./download.model";

/**
 * Central HTTP service used to proxy all requests to the API server
 */
@Injectable()
export class DataService {

  constructor(private http: Http,
              private authenticationService: AuthenticationService) {
  }

  /**
   * Gets data from the API server
   *
   * @param url the API endpoint
   * @param options parameters to communicate to the API
   * @returns {Observable<R>}
   */
  public get(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.http
      .get(`/api${url}`, options)
      .catch(this.handleException)
      .map(this.getMapper(options));
  }

  /**
   * Posts data to the API server
   *
   * @param url the API endpoint
   * @param options parameters to communicate to the API
   * @returns {Observable<R>}
   */
  public post(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.http
      .post(`/api${url}`, options)
      .catch(this.handleException)
      .map(this.getMapper(options));
  }

  /**
   * Handles HTTP responses in an exception state
   *
   * @param response the API server response
   * @returns {Observable<Response>}
   */
  private handleException(response: Response): Observable<Response> {
    if (response.status === 401) {
      this.authenticationService.handleAuthenticationFailure();
    }
    return Observable.throw(response);
  }

  /**
   * Resolves which mapper to use when mapping HTTP responses from the API server.
   * If the response type is {ResponseContentType.Blob} a {Download} mapper will be returned.
   * Otherwise a json {any} mapper will be returned
   *
   * @param options used to lookup the requested {ResponseContentType}
   * @returns {(response: Response) => any} the mapper
   */
  private getMapper(options?: RequestOptionsArgs): (response: Response) => any {
    if (options != null && options.responseType == ResponseContentType.Blob) {
      return (response: Response) => new Download(
        this.getFileNameFromResponse(response),
        new Blob([ response.blob() ], { type: this.getContentType(response) })
      );
    }
    return response => response.json();
  }

  /**
   * Gets the file name specified in the Content-Disposition HTTP response header
   *
   * @param response the HTTP response
   * @returns {string} the file name
   */
  private getFileNameFromResponse(response: Response): string {
    return response.headers.get('Content-Disposition').split(';')[ 1 ].trim().split('=')[ 1 ].replace(/"/g, '');
  }

  /**
   * Gets the content type of an HTTP response from the Content-Type HTTP response header
   *
   * @param response the HTTP response
   * @returns {string} the content type
   */
  private getContentType(response: Response): string {
    return response.headers.get('Content-Type').trim();
  }

}
