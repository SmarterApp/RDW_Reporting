import { Injectable } from '@angular/core';
import { CachingDataService } from '../data/caching-data.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReportingServiceRoute } from '../service-route';
import { Embargo } from './embargo';

@Injectable()
export class ReportingEmbargoService {
  constructor(private dataService: CachingDataService) {}

  /**
   * Gets the current embargo settings
   */
  isEmbargoed(schoolYear = null, districtId = null): Observable<Embargo> {
    if (!schoolYear || !districtId) {
      return of(null);
    }

    return this.dataService
      .get(
        `${ReportingServiceRoute}/organizations/${schoolYear}/${districtId}/embargoed`
      )
      .pipe(catchError(() => of(false)));
  }
}
