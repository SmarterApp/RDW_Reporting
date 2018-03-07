import Spy = jasmine.Spy;
import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';

export class MockRouter {

  public navigateByUrl: Spy = jasmine.createSpy("navigateByUrl");
  public navigate: Spy = jasmine.createSpy("navigate");
  public events = empty();

  constructor() {
    this.navigate.and.callFake(() => of(true).toPromise());
    this.navigateByUrl.and.callFake(() => of(true).toPromise());
  }
}
