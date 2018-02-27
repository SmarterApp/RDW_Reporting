import { Injectable } from "@angular/core";
import { DataService } from "../../shared/data/data.service";
import { Observable } from "rxjs/Observable";
import { Percentile, PercentileGroup } from "./assessment-percentile";
import { DatePipe } from "@angular/common";
import { map } from "rxjs/operators";
import * as _ from "lodash";
import { ReportingServiceRoute } from "../../shared/service-route";

/**
 * Service responsible for retrieving assessment percentile information
 */
@Injectable()
export class AssessmentPercentileService {

  constructor(private dataService: DataService,
              private datePipe: DatePipe) {
  }

  /**
   * Gets the percentiles for the given assessment and date range
   *
   * @param {AssessmentPercentileRequest} request the request parameters
   * @returns {Observable<Percentile[]>} the percentiles selected by the request
   */
  getPercentiles(request: AssessmentPercentileRequest): Observable<Percentile[]> {
    return this.dataService
      .get(`${ReportingServiceRoute}/assessment-percentiles`, {
        params: this.toServerRequest(request)
      });
  }

  /**
   * Gets the percentiles for the given assessment and date range and groups them if they share the same rank values.
   *
   * @param {AssessmentPercentileRequest} request the request parameters
   * @returns {Observable<Percentile[]>} the grouped percentiles selected by the request
   */
  getPercentilesGroupedByRank(request: AssessmentPercentileRequest): Observable<PercentileGroup[]> {
    return this.getPercentiles(request).pipe(map(percentiles => {
      if (percentiles.length == 0) {
        return [];
      }
      const groups: PercentileGroup[] = [];
      for (let i = 0; i < percentiles.length; i++) {
        const previousGroup = groups[ groups.length - 1 ];
        const percentile = percentiles[ i ];
        const percentileRanks = percentile.scores.map(score => score.rank);
        if (groups.length === 0
          || !_.isEqual(previousGroup.ranks, percentileRanks)) {
          groups.push({
            ranks: percentileRanks,
            percentiles: [ percentile ]
          })
        } else {
          previousGroup.percentiles.push(percentile);
        }
      }
      return groups;
    }));
  }

  private toServerRequest(request: AssessmentPercentileRequest): AssessmentPercentileServerRequest {
    return {
      assessmentId: request.assessmentId,
      startDate: this.formatAsLocalDate(request.from),
      endDate: this.formatAsLocalDate(request.to)
    };
  }

  private formatAsLocalDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

}

/**
 * Client API for making an assessment percentile request
 */
export interface AssessmentPercentileRequest {

  /**
   * The assessment entity ID
   */
  assessmentId: number;

  /**
   * The start date of the date range
   */
  from: Date;

  /**
   * The end date of the date range
   */
  to: Date;
}

/**
 * Server API for making an assessment percentile request
 */
interface AssessmentPercentileServerRequest {

  /**
   * The assessment entity ID
   */
  assessmentId: number;

  /**
   * The start date of the date range in yyyy-MM-dd format
   */
  startDate: string;

  /**
   * The end date of the date range in yyyy-MM-dd format
   */
  endDate: string;

}
