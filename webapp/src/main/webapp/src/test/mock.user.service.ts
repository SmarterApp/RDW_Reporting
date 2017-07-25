import { Observable } from "rxjs";
import { User } from "../app/user/model/user.model";

export class MockUserService {
  getCurrentUser() {
    return Observable.of(new User());
  }
}
