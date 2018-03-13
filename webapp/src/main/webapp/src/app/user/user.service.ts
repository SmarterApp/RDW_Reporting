import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { User } from "./user";
import { CachingDataService } from "../shared/data/caching-data.service";
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

const UnauthenticatedUser = of({
  firstName: '',
  lastName: '',
  permissions: []
});

@Injectable()
export class UserService {

  constructor(private dataService: CachingDataService) {
  }

  getUser(): Observable<User> {
    return this.dataService.get('/user').pipe(
      map(serverUser => <User>{
        firstName: serverUser.firstName,
        lastName: serverUser.lastName,
        permissions: serverUser.permissions
      }),
      catchError(error => UnauthenticatedUser)
    )
  }

}
