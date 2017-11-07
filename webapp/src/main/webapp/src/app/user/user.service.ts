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
    if(!isNullOrUndefined(this.currentUser))
      return Observable.of(this.currentUser);

    // currentUser is not populated and a request is not in progress.
    if(isNullOrUndefined(this.currentUserObservable)) {
      this.currentUserObservable = this._dataService
        .get("/user")
        .catch(res => {
          return Observable.of(null);
        })
        .share()
        .map(user => {
          if(isNullOrUndefined(user)) {
            return null;
          }

          return this._mapper.mapFromApi(user)
        });

      this.currentUserObservable.subscribe(user => this.currentUser = user);
    }

    // request for currentUser is already in progress, return that observable.
    return this.currentUserObservable;
  }

  doesCurrentUserHaveAnyPermissions(): Observable<boolean> {
    return new Observable(observer => {
      this.getCurrentUser().subscribe(user => {
        observer.next(!isNullOrUndefined(user)
          ? user.permissions.length !== 0
          : false);
        observer.complete();
      });
    });
  }

  doesCurrentUserHaveAtLeastOnePermission(permissions: string[]): Observable<boolean> {
    return new Observable(observer => {
      this.getCurrentUser().subscribe(user => {
        observer.next(!isNullOrUndefined(user)
          ? this.doesAtLeastOneExist(permissions, user.permissions)
          : false);
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
