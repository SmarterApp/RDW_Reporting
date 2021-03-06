import { Injectable } from '@angular/core';
import { ItemScoringGuideMapper } from './item-scoring-guide.mapper';
import { ItemScoringGuide } from './model/item-scoring-guide.model';
import { Observable } from 'rxjs';
import { DataService } from '../../../shared/data/data.service';
import { map } from 'rxjs/operators';
import { ReportingServiceRoute } from '../../../shared/service-route';

const ServiceRoute = ReportingServiceRoute;

@Injectable()
export class ItemScoringService {
  constructor(
    private dataService: DataService,
    private mapper: ItemScoringGuideMapper
  ) {}

  getGuide(bankItemKey: string): Observable<ItemScoringGuide> {
    return this.dataService
      .get(`${ServiceRoute}/examitems/${bankItemKey}/scoring`)
      .pipe(
        map(guide => {
          if (guide == null) {
            return null;
          }
          return this.mapper.mapFromApi(guide);
        })
      );
  }
}
