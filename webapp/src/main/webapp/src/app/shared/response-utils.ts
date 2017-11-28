import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { NotFoundError } from "./not-found.error";
/**
 * This class holds common response handling utility methods.
 */
export class ResponseUtils {

  /**
   * Handle a Bad Response codes as a null response.
   * Any other response code is re-thrown.
   *
   * @param response  The response
   * @returns {Observable} A null response for 404, otherwise an error
   *
   * @deprecated
   * @use ResponseUtils#throwError
   */
  static badResponseToNull(response: Response): Observable<Response> {
    if ([ 400, 403, 404 ].indexOf(response.status) !== -1) {
      return Observable.of(null);
    }
    return Observable.throw(response);
  }

  /**
   * Throws an appropriate error according to the non-2xx HTTP status of the response.
   * 404 throws a NotFoundError
   * All other error statuses throw an Error
   *
   * @param response the HTTP response
   */
  static throwError(response: Response): Observable<any> {
    if (response.status === 401) {
      return Observable.empty();
    }
    let message: string = `${response.status} ${response.statusText}`;
    let error:Error = response.status == 404
      ? new NotFoundError(message)
      : new Error(message);
    throw error;
  }

}
