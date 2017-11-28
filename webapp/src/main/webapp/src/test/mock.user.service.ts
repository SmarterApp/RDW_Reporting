import { Observable } from "rxjs/Observable";
import { User } from "../app/user/model/user.model";

export class MockUserService {
  getCurrentUser() {
    return Observable.of(new User());
  }
  doesCurrentUserHaveAtLeastOnePermission(permissions: string[]): Observable<boolean> {
    return Observable.of(true);
  }
}
