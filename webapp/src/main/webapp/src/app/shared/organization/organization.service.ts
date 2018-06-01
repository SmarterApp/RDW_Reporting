import { Observable } from "rxjs/Observable";
import { map, publishReplay, refCount } from "rxjs/operators";
import { CachingDataService } from "../data/caching-data.service";
import { DefaultSchool, OrganizationType, School } from "./organization";
import { ReportingServiceRoute } from "../service-route";
import { forkJoin } from "rxjs/observable/forkJoin";
import { Injectable } from "@angular/core";

@Injectable()
export class OrganizationService {

  constructor(protected dataService: CachingDataService) {
  }

  searchSchoolsByName(nameSearch: string): Observable<School[]> {
    return this.dataService.get(`${ReportingServiceRoute}/organizations`, {
      params: {
        name: nameSearch,
        types: [ OrganizationType.School ]
      }
    });

  }

  protected getSchoolGroups(): Observable<any[]> {
    return this.dataService.get(`${ReportingServiceRoute}/organizations/schoolGroups`);
  }

  getSchools(limit?: number): Observable<School[]> {
    return this.dataService.get(`${ReportingServiceRoute}/organizations/schools`, {
      params: {
        limit: limit
      }
    });
  }

  protected getDistricts(): Observable<any[]> {
    return this.dataService.get(`${ReportingServiceRoute}/organizations/districts`);
  }

  protected getDistrictNamesById(): Observable<Map<number, string>> {
    return this.getDistricts().pipe(
      map(districts => new Map<number, string>(
        districts.map(district => <any>[ district.id, district.name ])
      ))
    );
  }

  searchSchoolsWithDistrictsBySchoolName(nameSearch: string): Observable<School[]> {
    return forkJoin(
      this.searchSchoolsByName(nameSearch),
      this.getDistrictNamesById()
    ).pipe(
      map(([ schools, districtNamesById ]) => {
        return schools.map((school: DefaultSchool) => {
          school.districtName = districtNamesById.get(school.districtId);
          return school;
        });
      }),
      // when combined these operators act as a cache of the first valid result of the observable
      publishReplay(1),
      refCount()
    );
  }

  /**
   * Gets schools with district names.
   * This implementation caches the results for later calls.
   *
   * @returns {Observable<School[]>}
   */
  getSchoolsWithDistricts(limit?: number): Observable<School[]> {
    return forkJoin(
      this.getSchools(limit),
      this.getDistrictNamesById()
    ).pipe(
      map(([ schools, districtNamesById ]) => {
        return schools.map((school: DefaultSchool) => {
          school.districtName = districtNamesById.get(school.districtId);
          return school;
        });
      }),
      // when combined these operators act as a cache of the first valid result of the observable
      publishReplay(1),
      refCount()
    );
  }

}
