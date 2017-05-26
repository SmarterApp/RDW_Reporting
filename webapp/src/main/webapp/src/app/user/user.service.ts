import { Injectable } from "@angular/core";
import { UserMapper } from "./user.mapper";
import { CachingDataService } from "../shared/cachingData.service";
import { Observable } from "rxjs";

@Injectable()
export class UserService {
  constructor(private _mapper: UserMapper, private _dataService: CachingDataService) {
  }

  getCurrentUser() {
    return this._dataService
      .get("/user")
      .map(x => this._mapper.mapFromApi(x));
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
