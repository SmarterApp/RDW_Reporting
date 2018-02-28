import { Injectable } from "@angular/core";
import { CachingDataService } from "../data/caching-data.service";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { catchError, flatMap } from "rxjs/operators";
import { ReportingServiceRoute } from "../service-route";
import { UserService } from "../../user/user.service";
import { User } from "../../user/model/user.model";

@Injectable()
export class ReportingEmbargoService {

  constructor(private dataService: CachingDataService,
              private userService: UserService) {
  }

  /**
   * Gets user organization exam embargo status
   *
   * @returns {Observable<boolean>}
   */
  isEmbargoed(): Observable<boolean> {
    return this.userService.getCurrentUser()
      .pipe(
        flatMap((user: User) => {
          const embargoRead: boolean = user.permissions.indexOf("EMBARGO_READ") >= 0;
          if (!embargoRead) {
            return of(false);
          }

          return this.dataService.get(`${ReportingServiceRoute}/user-organizations/embargoed`)
            .pipe(catchError(response => of(false)))
        }),
      );
  }

}
