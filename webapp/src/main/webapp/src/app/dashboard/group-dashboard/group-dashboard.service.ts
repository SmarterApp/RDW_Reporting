import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ResponseUtils } from '../../shared/response-utils';
import { Injectable } from '@angular/core';
import { ReportingServiceRoute } from '../../shared/service-route';
import { DataService } from '../../shared/data/data.service';
import { URLSearchParams } from '@angular/http';
import { Group } from '../../groups/group';
import { MeasuredAssessment } from '../measured-assessment';
import { MeasuredAssessmentMapper } from '../measured-assessment.mapper';

const ServiceRoute = ReportingServiceRoute;

@Injectable()
export class GroupDashboardService {

  constructor(private dataService: DataService,
              private measuredAssessmentMapper: MeasuredAssessmentMapper) {
  }

  getAvailableMeasuredAssessments(group: Group, schoolYear: number): Observable<MeasuredAssessment[]> {
    return this.dataService.get(`${ServiceRoute}/groups/${group.id}/measuredassessments`, {
      search: this.getSchoolYearParams(schoolYear)
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverAssessments => this.measuredAssessmentMapper.mapMeasuredAssessmentsFromApi(serverAssessments))
    );
  }

  private getSchoolYearParams(schoolYear): URLSearchParams {
    const params: URLSearchParams = new URLSearchParams();
    params.set('schoolYear', schoolYear.toString());
    return params;
  }


}
