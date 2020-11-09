import { Injectable } from '@angular/core';
import { CachingDataService } from '../data/caching-data.service';
import { Observable } from 'rxjs';
import { AggregateServiceRoute } from '../service-route';

@Injectable()
export class AggregateEmbargoService {
  constructor(private dataService: CachingDataService) {}

  /**
   * Gets user organization exam embargo status
   *
   * @returns {Observable<boolean>}
   */
  isEmbargoed(year, districtId): Observable<boolean> {
    console.log('isEmbargoed', year, districtId);

    return this.dataService.get(
      `${AggregateServiceRoute}/organizations/embargoed`
    );
  }
}
