
import Spy = jasmine.Spy;

/**
 * Mock DataService for testing.
 */
export class MockDataService {

  public get: Spy = jasmine.createSpy("get");
  public post: Spy = jasmine.createSpy("post");
  public put: Spy = jasmine.createSpy("put");
  public delete: Spy = jasmine.createSpy("delete");

  constructor() {
  }

}
