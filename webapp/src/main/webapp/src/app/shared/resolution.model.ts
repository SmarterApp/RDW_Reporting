import { NotFoundError } from "./not-found.error";
import { Observable } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';

export class Resolution<T> {

  static ok<T>(data: T): Resolution<T> {
    return new Resolution<T>(data);
  }

  static error(error: Error): Resolution<any> {
    const resolution: Resolution<any> = new Resolution(null);
    resolution.error = error;
    return resolution;
  }

  static errorObservable(error: Error): Observable<Resolution<any>> {
    return of(Resolution.error(error));
  }

  public data: T;
  public error: Error;

  private constructor(data: T = null) {
    this.data = data;
  }

  public isOk(): boolean {
    return this.error == null;
  }

  public isError(): boolean {
    return this.error != null;
  }

  public isNotFound(): boolean {
    return this.error != null
      && this.error.name === 'NotFoundError';
  }

}
