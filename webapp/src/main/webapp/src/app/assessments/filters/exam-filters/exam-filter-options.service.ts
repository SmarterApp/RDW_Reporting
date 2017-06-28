import { CachingDataService } from "../../../shared/cachingData.service";
import { Injectable } from "@angular/core";
import { ExamFilterOptionsMapper } from "./exam-filter-options.mapper";

@Injectable()
export class ExamFilterOptionsService {
  constructor(private service: CachingDataService, private mapper: ExamFilterOptionsMapper) {
  }

  getExamFilterOptions() {
    return this.service
      .get("/examFilterOptions")
      .map(x => this.mapper.mapFromApi(x));
  }
}
