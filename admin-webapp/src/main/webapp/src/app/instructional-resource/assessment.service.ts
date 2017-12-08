import { Injectable } from "@angular/core";
import { DataService } from "@sbac/rdw-reporting-common-ngx";
import { Assessment } from "./model/assessment.model";
import { Observable } from "rxjs/Observable";
import { AssessmentQuery } from "./model/assessment-query.model";

/**
 * This service is responsible for interacting with assessments.
 */
@Injectable()
export class AssessmentService {

  constructor(private dataService: DataService) {
  }

  find(query: AssessmentQuery): Observable<Assessment[]> {
    return this.dataService.get("/assessments", {params: query})
      .map(AssessmentService.mapAssessmentsFromApi);
  }

  private static mapAssessmentsFromApi(apiModels): Assessment[] {
    return apiModels.map(x => AssessmentService.mapAssessmentFromApi(x));
  }

  private static mapAssessmentFromApi(apiModel: any): Assessment {
    let uiModel = new Assessment();

    uiModel.id = apiModel.id;
    uiModel.label = apiModel.label;
    uiModel.name = apiModel.name;
    uiModel.grade = apiModel.gradeCode;
    uiModel.type = apiModel.type;
    uiModel.subject = apiModel.subject;
    uiModel.claimCodes = apiModel.claimCodes || [];
    return uiModel;
  }
}
