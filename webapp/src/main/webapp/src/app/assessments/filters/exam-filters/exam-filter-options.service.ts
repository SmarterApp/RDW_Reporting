import { CachingDataService } from "../../../shared/cachingData.service";
import { Injectable } from "@angular/core";
import { ExamFilterOptionsMapper } from "./exam-filter-options.mapper";
import { Observable } from "rxjs";

@Injectable()
export class ExamFilterOptionsService {
  constructor(private service: CachingDataService, private mapper: ExamFilterOptionsMapper) {
  }

  getExamFilterOptions() {
    return this.service
      .get("/examFilterOptions")
      .catch((err) => {
        console.warn(err);
        return Observable.empty()
      })
      .map(x => this.mapper.mapFromApi(x));
  }
}
