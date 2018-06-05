import { Injectable } from '@angular/core';
import { ReportingServiceRoute } from '../service-route';
import { catchError, map } from 'rxjs/operators';
import { ResponseUtils } from '../response-utils';
import { AssessmentExamMapper } from '../../assessments/assessment-exam.mapper';
import { DataService } from '../data/data.service';

const ServiceRoute = ReportingServiceRoute;

@Injectable()
export class TargetService  {
  constructor(private dataService: DataService,
              private mapper: AssessmentExamMapper) {
  }

  getTargetsForAssessment(assessmentId: number) {
    return this.dataService.get(`${ServiceRoute}/assessment-targets`, {
      params: {
        id: assessmentId
      }
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverTargets => this.mapper.mapTargetsFromApi(serverTargets))
    );
  }
}
