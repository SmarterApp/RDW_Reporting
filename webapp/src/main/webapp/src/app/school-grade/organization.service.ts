import { Injectable } from "@angular/core";
import { UserService } from "../user/user.service";
import { School } from "../user/model/school.model";
import { Observable } from "rxjs/Observable";
import { CachingDataService } from "../shared/data/caching-data.service";
import { ReportingServiceRoute } from "../shared/service-route";
import { forkJoin } from "rxjs/observable/forkJoin";
import { map, publishReplay, refCount } from "rxjs/operators";


@Injectable()
export class OrganizationService {

  constructor(private userService: UserService,
              private dataService: CachingDataService) {
  }

  /**
   * Gets schools with district names.
   * This implementation caches the results for later calls.
   *
   * @returns {Observable<School[]>}
   */
  getSchoolsWithDistricts(): Observable<School[]> {
    return forkJoin(
      this.getSchools(),
      this.getDistrictNamesById()
    ).pipe(
      map(([ schools, districtNamesById ]) => {
        return schools.map(school => {
          school.districtName = districtNamesById.get(school.districtId);
          return school;
        });
      }),
      // when combined these operators act as a cache of the first valid result of the observable
      publishReplay(1),
      refCount()
    );
  }

  private getSchools(): Observable<School[]> {
    // TODO use /reporting-service/organizations/schools instead of user payload to untie user from reporting-service
    return this.userService.getCurrentUser().pipe(
      map(user => user.schools),
      publishReplay(1),
      refCount()
    );
  }

  private getDistricts(): Observable<any[]> {
    return this.dataService.get(`${ReportingServiceRoute}/organizations/districts`);
  }

  private getDistrictNamesById(): Observable<Map<number, string>> {
    return this.getDistricts().pipe(
      map(districts => new Map<number, string>(districts.map(district => <any>[ district.id, district.name ])))
    );
  }

}
