import { Observable } from "rxjs/Observable";
import { User } from "../app/user/model/user.model";
import Spy = jasmine.Spy;

export class MockUserService {

  getCurrentUser: Spy = jasmine.createSpy("getCurrentUser");
  doesCurrentUserHaveAtLeastOnePermission: Spy = jasmine.createSpy("doesCurrentUserHaveAtLeastOnePermission");

  constructor() {
    this.getCurrentUser.and.returnValue(Observable.of(new User()));
    this.doesCurrentUserHaveAtLeastOnePermission.and.returnValue(Observable.of(true));
  }

}
