import { Response } from "@angular/http";
import { Observable } from "rxjs";
/**
 * This class holds common response handling utility methods.
 */
export class ResponseUtils {

  /**
   * Handle a 404 Response code as a null response.
   * Any other response code is re-thrown.
   *
   * @param response  The response
   * @returns {Observable} A null response for 404, otherwise an error
   */
  static notFoundToNull(response: Response): Observable<Response> {
    if (response.status === 404) {
      return Observable.of(null);
    }
    return Observable.throw(response);
  }

  /**
   * Handle a 404 Response code as an empty array response.
   * Any other response code is re-thrown.
   *
   * @param response  The response
   * @returns {Observable} An empty array response for 404, otherwise an error
   */
  static notFoundToEmptyArray(response: Response): Observable<Response> {
    if (response.status === 404) {
      return Observable.of(null);
    }
    return Observable.throw(response);
  }

}
