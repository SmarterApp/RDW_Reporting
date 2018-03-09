import { Injectable } from "@angular/core";
import { School } from "../school-grade/school";
import { Observable } from "rxjs/Observable";
import { CachingDataService } from "../shared/data/caching-data.service";
import { ReportingServiceRoute } from "../shared/service-route";
import { forkJoin } from "rxjs/observable/forkJoin";
import { map, publishReplay, refCount } from "rxjs/operators";


@Injectable()
export class OrganizationService {

  constructor(private dataService: CachingDataService) {
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
    return this.dataService.get(`${ReportingServiceRoute}/organizations/schools`);
  }

  private getDistricts(): Observable<any[]> {
    return this.dataService.get(`${ReportingServiceRoute}/organizations/districts`);
  }

  private getDistrictNamesById(): Observable<Map<number, string>> {
    return this.getDistricts().pipe(
      map(districts => new Map<number, string>(
        districts.map(district => <any>[ district.id, district.name ])
      ))
    );
  }

}
