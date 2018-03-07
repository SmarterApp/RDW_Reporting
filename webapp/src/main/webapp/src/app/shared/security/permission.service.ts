import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { of } from 'rxjs/observable/of';

/**
 * Null permission service placeholder.
 * This should be overridden with a permission service that provides the user permissions
 */
@Injectable()
export class PermissionService {

  /**
   * Gets the user permissions
   *
   * @returns {Observable<string[]>} array of permission identifiers
   */
  getPermissions(): Observable<string[]> {
    return of([]);
  };

}
