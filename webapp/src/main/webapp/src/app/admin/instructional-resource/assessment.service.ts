import { Injectable } from '@angular/core';
import { Assessment } from './model/assessment.model';
import { Observable } from 'rxjs/Observable';
import { AssessmentQuery } from './model/assessment-query.model';
import { DataService } from '../../shared/data/data.service';
import { map } from 'rxjs/operators';
import { AdminServiceRoute } from '../../shared/service-route';

const ServiceRoute = AdminServiceRoute;

/**
 * This service is responsible for interacting with assessments.
 */
@Injectable()
export class AssessmentService {

  constructor(private dataService: DataService) {
  }

  find(query: AssessmentQuery): Observable<Assessment[]> {
    return this.dataService.get(`${ServiceRoute}/assessments`, { params: <any>query }).pipe(
      map(serverAssessments => serverAssessments.map(serverAssessment => {
        const assessment = new Assessment();
        assessment.id = serverAssessment.id;
        assessment.label = serverAssessment.label;
        assessment.name = serverAssessment.name;
        assessment.grade = serverAssessment.gradeCode;
        assessment.type = serverAssessment.typeCode;
        assessment.subject = serverAssessment.subjectCode;
        assessment.claimCodes = serverAssessment.claimCodes || [];
        return assessment;
      }))
    );
  }

}
