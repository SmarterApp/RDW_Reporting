import { Injectable } from "@angular/core";
import { DataService } from "../../../shared/data/data.service";
import { ItemScoringGuideMapper } from "./item-scoring-guide.mapper";
import { ItemScoringGuide } from "./model/item-scoring-guide.model";
import { Observable } from "rxjs";

@Injectable()
export class ItemScoringService {
  constructor(private dataService: DataService, private mapper: ItemScoringGuideMapper){
  }

  getGuide(bankItemKey: string): Observable<ItemScoringGuide>{
    return this.dataService
      .get(`/examitems/${bankItemKey}/scoring`)
      .catch((err) => {
        console.warn(err);
        return Observable.empty();
      })
      .map(guide => this.mapper.mapFromApi(guide));
  }
}
