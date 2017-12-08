import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Http, RequestOptionsArgs, Response, ResponseContentType } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Download } from "./download.model";

export const DATA_CONTEXT_URL = new InjectionToken<string>('CONTEXT_URL');

/**
 * Central HTTP service used to proxy all requests to the API server
 */
@Injectable()
export class DataService {

  constructor(private http: Http,
              @Inject(DATA_CONTEXT_URL) private contextUrl: string = '/api') {
  }

  /**
   * Gets data from the API server
   *
   * @param url the API endpoint
   * @param options parameters to communicate to the API
   * @returns {Observable<R>}
   */
  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.http
      .get(`${this.contextUrl}${url}`, options)
      .map(this.getMapper(options));
  }

  /**
   * Posts data to the API server
   *
   * @param url the API endpoint
   * @param body the request body
   * @param options parameters to communicate to the API
   * @returns {Observable<R>}
   */
  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.http
      .post(`${this.contextUrl}${url}`, body, options)
      .map(this.getMapper(options));
  }

  /**
   * Puts data to the API server
   *
   * @param url the API endpoint
   * @param body the request body
   * @param options parameters to communicate to the API
   * @returns {Observable<R>}
   */
  put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.http
      .put(`${this.contextUrl}${url}`, body, options)
      .map(this.getMapper(options));
  }

  /**
   * Deletes data on the API server
   *
   * @param url the API endpoint
   * @param options parameters to communicate to the API
   * @returns {Observable<any>}
   */
  delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.http
      .delete(`${this.contextUrl}${url}`, options)
      .map(this.getMapper(options));
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
        this.safelyFormatFileName(this.getFileNameFromResponse(response)),
        new Blob([ response.blob() ], { type: this.getContentType(response) })
      );
    }
    return response => response.json();
  }

  /**
   * Replaces whitespace in the given name with underscores.
   * This implementation is null-safe and will return null if provided null.
   *
   * @param name the name to format
   * @returns {string} thre formatted name
   */
  private safelyFormatFileName(name: string) {
    return name == null ? null : name.replace(/[&~@#$^*_+=/:?;\\|<>"',]/g, '').replace(/\s+/g, '_');
  }

  /**
   * Gets the file name specified in the Content-Disposition HTTP response header
   *
   * @param response the HTTP response
   * @returns {string} the file name
   */
  private getFileNameFromResponse(response: Response): string {
    let header: string = response.headers.get('Content-Disposition');
    return header == null ? null : this.decodeHeaderFieldValue(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/g.exec(header)[ 1 ]);
  }

  /**
   * Decodes a possibly encoded header field value such as the Content-Disposition filename
   *
   * @param value the header value
   * @returns {any} the decoded header value
   */
  private decodeHeaderFieldValue(value: string): string {
    if (value == null) {
      return null;
    }
    let utf8Prefix: string = "UTF-8''";
    if (value.toUpperCase().startsWith(utf8Prefix)) {
      return decodeURIComponent(value.substring(utf8Prefix.length));
    }
    return value;
  }

  /**
   * Gets the content type of an HTTP response from the Content-Type HTTP response header
   *
   * @param response the HTTP response
   * @returns {string} the content type
   */
  private getContentType(response: Response): string {
    let header: string = response.headers.get('Content-Type');
    return header == null ? null : header.trim();
  }

}
