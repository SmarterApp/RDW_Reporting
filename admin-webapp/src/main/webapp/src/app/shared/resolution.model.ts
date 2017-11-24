import { Observable } from "rxjs";

export class Resolution<T> {

  static error(error: Error): Resolution<any> {
    let resolution: Resolution<any> = new Resolution(null);
    resolution.error = error;
    return resolution;
  }

  static errorObservable(error: Error): Observable<Resolution<any>> {
    return Observable.of(Resolution.error(error));
  }

  public data: T;
  public error: Error;

  private constructor(data: T = null) {
    this.data = data;
  }

}
