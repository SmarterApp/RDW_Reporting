import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AggregateReportOptions } from "./aggregate-report-options";
import { CachingDataService } from "../shared/data/caching-data.service";

const ServiceRoute = '/aggregate-service';

/**
 * Service responsible for gathering aggregate report options from the server
 */
@Injectable()
export class AggregateReportOptionsService {

  constructor(private dataService: CachingDataService) {
  }

  getReportOptions(): Observable<AggregateReportOptions> {
    return this.dataService.get(`${ServiceRoute}/reportOptions`);
  }

}
