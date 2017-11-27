import { Injectable } from "@angular/core";
import { UserMapper } from "./user.mapper";
import { CachingDataService } from "@sbac/rdw-reporting-common-ngx";
import { Observable } from "rxjs";
import { User } from "./model/user.model";
import { isNullOrUndefined } from "util";

@Injectable()
export class UserService {
  constructor(private _mapper: UserMapper, private _dataService: CachingDataService) {
  }

  private currentUser: User;
  private currentUserObservable: Observable<User>;

  getCurrentUser(): Observable<User> {
    // currentUser has already been populated, return that.
    if (!isNullOrUndefined(this.currentUser))
      return Observable.of(this.currentUser);

    // currentUser is not populated and a request is not in progress.
    if (isNullOrUndefined(this.currentUserObservable)) {
      this.currentUserObservable = this._dataService
        .get("/user")
        .share()
        .map(x => this._mapper.mapFromApi(x));

      this.currentUserObservable.subscribe(user => this.currentUser = user);
    }

    // request for currentUser is already in progress, return that observable.
    return this.currentUserObservable;
  }

  doesCurrentUserHaveAtLeastOnePermission(permissions: string[]): Observable<boolean> {
    return new Observable(observer => {
      this.getCurrentUser().subscribe(user => {
        observer.next(this.doesAtLeastOneExist(permissions, user.permissions));
        observer.complete();
      });
    });
  }

  private doesAtLeastOneExist(permissions: string[], userPermissions) {
    return userPermissions.some(x =>
      permissions.some(y =>
        x.toUpperCase() == y.toUpperCase()
      )
    );
  }
}
