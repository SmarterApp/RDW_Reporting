
import Spy = jasmine.Spy;

/**
 * Mock DataService for testing.
 */
export class MockDataService {

  public get: Spy = jasmine.createSpy("get");

  constructor() {
  }

}
