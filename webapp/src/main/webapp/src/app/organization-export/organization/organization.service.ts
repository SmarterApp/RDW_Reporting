import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { UserOrganizations } from "./user-organizations";
import { OrganizationMapper } from "./organization.mapper";
import { CachingDataService } from "../../shared/data/caching-data.service";
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { OrganizationService as ExtendOrganizationService } from "../../shared/organization/organization.service";

@Injectable()
export class OrganizationService extends ExtendOrganizationService {

  constructor(protected dataService: CachingDataService,
              private mapper: OrganizationMapper) {
    super(dataService);
  }

  /**
   * Gets the all organizations entitled to the user and groups them by type
   * Because the component caches the schools and doesn't go back to the server
   * during type-ahead search or when adding districts/groups, this needs to
   * get *every* school for the user. So use a large limit.
   *
   * @returns {Observable<UserOrganizations>}
   */
  getUserOrganizations(): Observable<UserOrganizations> {
    return forkJoin(
      this.getSchools(1000),
      this.getSchoolGroups(),
      this.getDistricts()
    ).pipe(
      map(([ schools, schoolGroups, districts ]) => {
        return this.mapper.createUserOrganizations(schools, schoolGroups, districts);
      })
    );
  }

}
