import { Injectable } from "@angular/core";
import { UserService } from "../user/user.service";
import { School } from "../user/model/school.model";
import { Observable } from "rxjs/Observable";
import { CachingDataService } from "@sbac/rdw-reporting-common-ngx";

@Injectable()
export class OrganizationService {

  private schoolsWithDistricts: Observable<School[]>;

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
    if (this.schoolsWithDistricts) {
      return this.schoolsWithDistricts;
    }
    return this.schoolsWithDistricts = Observable
      .forkJoin(
        this.userService.getCurrentUser(),
        this.getDistrictNamesById()
      )
      .map(response => {
        let [ user, districts ] = response;
        return user.schools.map(school => {
          school.districtName = districts.get(school.districtId);
          return school;
        });
      });
  }

  private getDistrictNamesById() {
    return this.dataService
      .get('/organizations/districts')
      .map(districts => new Map<number, string>(districts.map(x => [ x.id, x.name ])));
  }
}
