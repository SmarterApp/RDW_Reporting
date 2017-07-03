import Spy = jasmine.Spy;

export class MockRouter {

  public navigateByUrl: Spy = jasmine.createSpy("navigateByUrl");

  constructor() {}
}
