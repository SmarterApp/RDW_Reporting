import Spy = jasmine.Spy;
import { Observable } from "rxjs/Observable";

export class MockRouter {

  public navigateByUrl: Spy = jasmine.createSpy("navigateByUrl");
  public navigate: Spy = jasmine.createSpy("navigate");
  public events = Observable.empty();

  constructor() {
    this.navigate.and.callFake(() => Observable.of(true).toPromise());
    this.navigateByUrl.and.callFake(() => Observable.of(true).toPromise());
  }
}
