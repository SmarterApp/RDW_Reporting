import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;

export class MockActivatedRoute {
  snapshotResult: Spy = createSpy("snapshot");

  get snapshot(): any {
    return this.snapshotResult();
  }
}

