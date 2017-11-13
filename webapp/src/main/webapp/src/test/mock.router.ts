import Spy = jasmine.Spy;
import { Observable } from "rxjs/Observable";
import { UrlTree } from "@angular/router";

export class MockRouter {

  public navigateByUrl: Spy = jasmine.createSpy("navigateByUrl");
  public navigate: Spy = jasmine.createSpy("navigate");
  public createUrlTree: Spy = jasmine.createSpy("createUrlTree");
  public serializeUrl: Spy = jasmine.createSpy("serializeUrl");
  public events = Observable.empty();

  constructor() {
    this.navigate.and.callFake(() => Observable.of(true).toPromise());
    this.navigateByUrl.and.callFake(() => Observable.of(true).toPromise());
    this.createUrlTree.and.callFake(() => new UrlTree());
    this.serializeUrl.and.callFake(() => "/");
  }
}
