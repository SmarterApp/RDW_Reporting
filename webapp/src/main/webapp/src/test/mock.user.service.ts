import { of } from 'rxjs/observable/of';
import Spy = jasmine.Spy;

export class MockUserService {

  getUser: Spy = jasmine.createSpy("getUser");

  constructor() {
    this.getUser.and.returnValue(of({
      firstName: '',
      lastName: '',
      permissions: []
    }));
  }

}
