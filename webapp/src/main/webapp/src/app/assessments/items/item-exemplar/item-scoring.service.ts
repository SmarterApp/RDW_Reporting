import { Injectable } from "@angular/core";
import { DataService } from "@sbac/rdw-reporting-common-ngx";
import { ItemScoringGuideMapper } from "./item-scoring-guide.mapper";
import { ItemScoringGuide } from "./model/item-scoring-guide.model";
import { Observable } from "rxjs/Observable";

const ServiceRoute = '/reporting-service';

@Injectable()
export class ItemScoringService {
  constructor(private dataService: DataService, private mapper: ItemScoringGuideMapper){
  }

  getGuide(bankItemKey: string): Observable<ItemScoringGuide>{
    return this.dataService
      .get(`${ServiceRoute}/examitems/${bankItemKey}/scoring`)
      .map((guide) => {
        if (guide == null) return null;

        return this.mapper.mapFromApi(guide);
      });
  }
}
