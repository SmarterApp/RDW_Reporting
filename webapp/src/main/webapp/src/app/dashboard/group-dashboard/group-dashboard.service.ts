import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ResponseUtils } from '../../shared/response-utils';
import { Injectable } from '@angular/core';
import { ReportingServiceRoute } from '../../shared/service-route';
import { DataService } from '../../shared/data/data.service';
import { MeasuredAssessment } from '../measured-assessment';
import { MeasuredAssessmentMapper } from '../measured-assessment.mapper';
import { Search } from '../../groups/results/group-assessment.service';

const ServiceRoute = ReportingServiceRoute;

@Injectable()
export class GroupDashboardService {

  constructor(private dataService: DataService,
              private measuredAssessmentMapper: MeasuredAssessmentMapper) {
  }

  getAvailableMeasuredAssessments(search: Search): Observable<MeasuredAssessment[]> {
    return this.dataService.get(`${ServiceRoute}/measuredassessments`, {
      params: <any>search
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverAssessments => this.measuredAssessmentMapper.mapMeasuredAssessmentsFromApi(serverAssessments))
    );
  }

}
