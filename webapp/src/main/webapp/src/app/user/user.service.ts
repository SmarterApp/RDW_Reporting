import { Injectable } from "@angular/core";
import { UserMapper } from "./user.mapper";
import { CachingDataService, Utils } from "@sbac/rdw-reporting-common-ngx";
import { Observable } from "rxjs/Observable";
import { User } from "./model/user.model";

@Injectable()
export class UserService {

  private currentUser: User;
  private currentUserObservable: Observable<User>;

  constructor(private _mapper: UserMapper,
              private _dataService: CachingDataService) {
  }

  getCurrentUser(): Observable<User> {
    // currentUser has already been populated, return that.
    if(!Utils.isNullOrUndefined(this.currentUser)) {
      return Observable.of(this.currentUser);
    }
    // currentUser is not populated and a request is not in progress.
    if(Utils.isNullOrUndefined(this.currentUserObservable)) {
      this.currentUserObservable = this._dataService
        .get("/user")
        .catch(res => {
          return Observable.of(null);
        })
        .share()
        .map(user => {
          if(Utils.isNullOrUndefined(user)) {
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
        observer.next(!Utils.isNullOrUndefined(user)
          ? user.permissions.length !== 0
          : false);
        observer.complete();
      });
    });
  }

  doesCurrentUserHaveAtLeastOnePermission(permissions: string[]): Observable<boolean> {
    return new Observable(observer => {
      this.getCurrentUser().subscribe(user => {
        observer.next(!Utils.isNullOrUndefined(user)
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
