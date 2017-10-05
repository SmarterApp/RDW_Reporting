import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { CachingDataService } from "app/shared/cachingData.service";
import { UserOrganizations } from "./user-organizations";
import { OrganizationMapper } from "./organization.mapper";

@Injectable()
export class OrganizationService {

  constructor(private dataService: CachingDataService,
              private mapper: OrganizationMapper) {
  }

  /**
   * Gets the all organizations entitled to the user and groups them by type
   *
   * @returns {Observable<UserOrganizations>}
   */
  getUserOrganizations(): Observable<UserOrganizations> {
    return Observable.forkJoin(
      this.getSchools(),
      this.getSchoolGroups(),
      this.getDistricts()
    ).map(response => {
      let [ schools, schoolGroups, districts ] = response;
      return this.mapper.createUserOrganizations(schools, schoolGroups, districts);
    });
  }

  private getSchools(): Observable<any[]> {
    return this.dataService.get('/organizations/schools');
  }

  private getSchoolGroups(): Observable<any[]> {
    return this.dataService.get('/organizations/schoolGroups');
  }

  private getDistricts(): Observable<any[]> {
    return this.dataService.get('/organizations/districts');
  }

}
