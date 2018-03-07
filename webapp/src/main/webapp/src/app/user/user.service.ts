import { Injectable } from "@angular/core";
import { UserMapper } from "./user.mapper";
import { Observable } from "rxjs/Observable";
import { User } from "./model/user.model";
import { CachingDataService } from "../shared/data/caching-data.service";
import { Utils } from "../shared/support/support";
import { of } from 'rxjs/observable/of';
import { catchError, map, share } from 'rxjs/operators';

const ServiceRoute = '/reporting-service';

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
      return of(this.currentUser);
    }
    // currentUser is not populated and a request is not in progress.
    if(Utils.isNullOrUndefined(this.currentUserObservable)) {
      this.currentUserObservable = this._dataService.get(`${ServiceRoute}/user`)
        .pipe(
          catchError(() => of(null)),
          share(),
          map(user => {
            if(Utils.isNullOrUndefined(user)) {
              return null;
            }
            return this._mapper.mapFromApi(user)
          })
        );

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
    return userPermissions.some(userPermission =>
      permissions.some(permission =>
        userPermission.toUpperCase() == permission.toUpperCase()
      )
    );
  }
}
