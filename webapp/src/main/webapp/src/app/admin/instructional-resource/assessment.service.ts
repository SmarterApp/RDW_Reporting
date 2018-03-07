import { Injectable } from "@angular/core";
import { Assessment } from "./model/assessment.model";
import { Observable } from "rxjs/Observable";
import { AssessmentQuery } from "./model/assessment-query.model";
import { DataService } from "../../shared/data/data.service";
import { map } from 'rxjs/operators';

const ServiceRoute = '/admin-service';

/**
 * This service is responsible for interacting with assessments.
 */
@Injectable()
export class AssessmentService {

  constructor(private dataService: DataService) {
  }

  find(query: AssessmentQuery): Observable<Assessment[]> {
    return this.dataService.get(`${ServiceRoute}/assessments`, {params: query})
      .pipe(
        map(AssessmentService.mapAssessmentsFromApi)
      );
  }

  private static mapAssessmentsFromApi(serverAssessments: any[]): Assessment[] {
    return serverAssessments.map(serverAssessment => AssessmentService.mapAssessmentFromApi(serverAssessment));
  }

  private static mapAssessmentFromApi(serverAssessment: any): Assessment {
    const assessment = new Assessment();
    assessment.id = serverAssessment.id;
    assessment.label = serverAssessment.label;
    assessment.name = serverAssessment.name;
    assessment.grade = serverAssessment.gradeCode;
    assessment.type = serverAssessment.type;
    assessment.subject = serverAssessment.subject;
    assessment.claimCodes = serverAssessment.claimCodes || [];
    return assessment;
  }

}
