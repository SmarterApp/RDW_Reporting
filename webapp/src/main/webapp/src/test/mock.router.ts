import Spy = jasmine.Spy;
import { UrlTree } from "@angular/router";
import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';

export class MockRouter {

  public navigateByUrl: Spy =  jasmine.createSpy("navigateByUrl");
  public navigate: Spy = jasmine.createSpy("navigate");
  public createUrlTree: Spy = jasmine.createSpy("createUrlTree");
  public serializeUrl: Spy = jasmine.createSpy("serializeUrl");
  public events = empty();

  constructor() {
    this.navigate.and.callFake(() => of(true).toPromise());
    this.navigateByUrl.and.callFake(() => of(true).toPromise());
    this.createUrlTree.and.callFake(() => new UrlTree());
    this.serializeUrl.and.callFake(() => "/");
  }
}
