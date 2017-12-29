import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AggregateReportItem } from "../model/aggregate-report-item.model";
import { ResponseUtils } from "../../shared/response-utils";
import { AssessmentDetailsService } from "./assessment-details.service";
import { AggregateReportQuery } from "../model/aggregate-report-query.model";
import { AssessmentDetails } from "../model/assessment-details.model";
import { HttpClient } from "@angular/common/http";
import { UserService } from "../../user/user.service";
import { User } from "../../user/model/user.model";

/**
 * This placeholder service will eventually submit an AggregateReportQuery
 * to the backend and return the list of supplied AggregateReportItem results.
 *
 * As a mock service, this just returns the sample payload at /assets/public/test-aggregate.json
 */
@Injectable()
export class MockAggregateReportsService {

  constructor(private http: HttpClient,
              private assessmentDetailsService: AssessmentDetailsService,
              private userService: UserService) {
  }

  public getReportData(query: AggregateReportQuery): Observable<AggregateReportItem[]> {
    let userObservable: Observable<User> = this.userService.getCurrentUser();
    let detailsObservable: Observable<AssessmentDetails> = this.assessmentDetailsService.getDetails(query.assessmentType);
    let dataObservable: Observable<Object> = this.http.get(`/assets/public/test-aggregate.json`)
      .catch(ResponseUtils.badResponseToNull);
    return Observable.forkJoin(detailsObservable, userObservable, dataObservable)
      .map((value) => {
        let details: AssessmentDetails = value[0];
        let user: User = value[1];
        let apiReportItems: any = value[2];

        if (apiReportItems === null) return [];
        return this.mapReportItemsFromApi(details, user, apiReportItems);
      });
  }

  private mapReportItemsFromApi(details: AssessmentDetails, user: User, apiModels: any[]): AggregateReportItem[] {
    return apiModels.map((apiModel, idx) => this.mapReportItemFromApi(details, user, apiModel, idx));
  }

  private mapReportItemFromApi(details: AssessmentDetails, user: User, apiModel: any, idx: number): AggregateReportItem {
    let uiModel = new AggregateReportItem();
    uiModel.assessmentId = apiModel.assessment.id;
    uiModel.gradeId = apiModel.assessment.gradeId;
    uiModel.subjectId = apiModel.assessment.subjectId;
    uiModel.schoolYear = apiModel.examSchoolYear;
    uiModel.organizationType = apiModel.organization.type;
    uiModel.organizationName = (uiModel.organizationType == "State")
      ? user.configuration.stateName
      : apiModel.organization.name;
    uiModel.organizationId = apiModel.organization.id;
    uiModel.dimensionType = apiModel.dimension.type;
    uiModel.dimensionValue = apiModel.dimension.code || 'default';
    uiModel.itemId = idx;

    let apiMeasures = apiModel.measures || {};
    uiModel.avgScaleScore = apiMeasures.avgScaleScore || 0;
    uiModel.avgStdErr = apiMeasures.avgStdErr || 0;

    let totalTested: number = 0;
    for (let level = 1; level <= details.performanceLevels; level++) {
      let count = apiMeasures[`level${level}Count`] || 0;
      totalTested += count;
      uiModel.performanceLevelCounts.push(count);
    }
    uiModel.studentsTested = totalTested;

    for (let level = 0; level < uiModel.performanceLevelCounts.length; level++) {
      let percent = totalTested == 0 ? 0 : Math.floor((uiModel.performanceLevelCounts[level] / totalTested) * 100);
      uiModel.performanceLevelPercents.push(percent);
    }

    //If there is a rollup level, calculate the grouped values
    if (details.performanceGroupingCutpoint > 0) {
      let belowCount: number = 0;
      let aboveCount: number = 0;
      for (let level = 0; level < uiModel.performanceLevelCounts.length; level++) {
        if (level < details.performanceGroupingCutpoint - 1) {
          belowCount += uiModel.performanceLevelCounts[level];
        } else {
          aboveCount += uiModel.performanceLevelCounts[level];
        }
      }
      uiModel.groupedPerformanceLevelCounts.push(belowCount);
      uiModel.groupedPerformanceLevelPercents.push(totalTested == 0 ? 0 : Math.floor((belowCount / totalTested) * 100));
      uiModel.groupedPerformanceLevelCounts.push(aboveCount);
      uiModel.groupedPerformanceLevelPercents.push(totalTested == 0 ? 0 : Math.floor((aboveCount / totalTested) * 100));
    }

    return uiModel;
  }
}
