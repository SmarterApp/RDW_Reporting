import Spy = jasmine.Spy;
import { Observable } from "rxjs";

export class MockRouter {

  public events = Observable.of({});

  public navigateByUrl: Spy = jasmine.createSpy("navigateByUrl");
  public navigate: Spy = jasmine.createSpy("navigate");

  constructor() {}
}
