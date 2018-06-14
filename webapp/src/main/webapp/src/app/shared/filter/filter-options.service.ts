import { Injectable } from '@angular/core';
import { FilterOptions } from './filter-options';
import { Observable } from 'rxjs/Observable';
import { CachingDataService } from '../data/caching-data.service';
import { ReportingServiceRoute } from '../service-route';
import { map } from 'rxjs/operators';

@Injectable()
export class FilterOptionsService {

  constructor(private dataService: CachingDataService) {
  }

  getFilterOptions(): Observable<FilterOptions> {

    const Booleans = ['yes', 'no', 'undefined'];

    return this.dataService.get(`${ReportingServiceRoute}/examFilterOptions`).pipe(
      map(serverOptions => <FilterOptions>{

        // exam related
        schoolYears: serverOptions.schoolYears,
        subjects: serverOptions.subjects,
        completenesses: ['Complete', 'Partial'],
        interimAdministrationConditions: ['SD', 'NS'],
        summativeAdministrationConditions: ['Valid', 'IN'],

        // student related
        genders: serverOptions.genders,
        ethnicities: serverOptions.ethnicities,
        englishLanguageAcquisitionStatuses: serverOptions.elasCodes,
        individualEducationPlans: Booleans,
        limitedEnglishProficiencies: Booleans,
        section504s: Booleans,
        migrantStatuses: Booleans
      })
    );
  }

}
