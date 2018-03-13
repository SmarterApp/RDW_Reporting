import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { UserOrganizations } from "./user-organizations";
import { OrganizationMapper } from "./organization.mapper";
import { CachingDataService } from "../../shared/data/caching-data.service";
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ReportingServiceRoute } from '../../shared/service-route';

const ServiceRoute = ReportingServiceRoute;

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
    return forkJoin(
      this.getSchools(),
      this.getSchoolGroups(),
      this.getDistricts()
    ).pipe(
      map(([ schools, schoolGroups, districts ]) => {
        return this.mapper.createUserOrganizations(schools, schoolGroups, districts);
      })
    );
  }

  private getSchools(): Observable<any[]> {
    // TODO cache - this is widely used
    return this.dataService.get(`${ServiceRoute}/organizations/schools`);
  }

  private getSchoolGroups(): Observable<any[]> {
    return this.dataService.get(`${ServiceRoute}/organizations/schoolGroups`);
  }

  private getDistricts(): Observable<any[]> {
    return this.dataService.get(`${ServiceRoute}/organizations/districts`);
  }

}
