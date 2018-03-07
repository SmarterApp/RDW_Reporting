import { User } from "../app/user/model/user.model";
import { of } from 'rxjs/observable/of';
import Spy = jasmine.Spy;

export class MockUserService {

  getCurrentUser: Spy = jasmine.createSpy("getCurrentUser");
  doesCurrentUserHaveAtLeastOnePermission: Spy = jasmine.createSpy("doesCurrentUserHaveAtLeastOnePermission");

  constructor() {
    this.getCurrentUser.and.returnValue(of(new User()));
    this.doesCurrentUserHaveAtLeastOnePermission.and.returnValue(of(true));
  }

}
