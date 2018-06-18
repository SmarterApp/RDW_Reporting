import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;
import { EventEmitter } from '@angular/core';

export class MockActivatedRoute {
  snapshotResult: Spy = createSpy("snapshot");
  params: EventEmitter<any> = new EventEmitter();
  data: EventEmitter<any> = new EventEmitter();

  get snapshot(): any {
    return this.snapshotResult();
  }
}

