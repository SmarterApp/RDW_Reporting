import { CachingDataService } from "@sbac/rdw-reporting-common-ngx";
import { Injectable } from "@angular/core";
import { ExamFilterOptionsMapper } from "./exam-filter-options.mapper";

const ServiceRoute = '/reporting-service';

@Injectable()
export class ExamFilterOptionsService {
  constructor(private service: CachingDataService, private mapper: ExamFilterOptionsMapper) {
  }

  getExamFilterOptions() {
    return this.service
      .get(`${ServiceRoute}/examFilterOptions`)
      .map(x => this.mapper.mapFromApi(x));
  }
}
