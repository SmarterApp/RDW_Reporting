import { Injectable } from "@angular/core";
import { CachingDataService } from "../data/caching-data.service";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { catchError, map } from "rxjs/operators";
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
    const embargoEnabled: Observable<boolean> = this.dataService.get(`${ReportingServiceRoute}/user-organizations/embargoed`)
    // fill for backend - if the backend is not there return true by default
      .pipe(catchError(response => of({enabled: true})));

    const embargoRead: Observable<boolean> = this.userService.getCurrentUser()
      .pipe(map((user: User) => user.permissions.indexOf("EMBARGO_READ") >= 0));

    return Observable.forkJoin(embargoEnabled, embargoRead)
      .pipe(map(values => values[0] && values[1]));
  }

}
