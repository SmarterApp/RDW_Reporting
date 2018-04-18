import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ResponseUtils } from '../shared/response-utils';
import { Injectable } from '@angular/core';
import { ReportingServiceRoute } from '../shared/service-route';
import { DataService } from '../shared/data/data.service';
import { URLSearchParams } from '@angular/http';
import { Group } from '../groups/group';
import { AssessmentExamMapper } from '../assessments/assessment-exam.mapper';
import { MeasuredAssessment } from './measured-assessment';

const ServiceRoute = ReportingServiceRoute;

@Injectable()
export class GroupCardService {
  group: Group;
  schoolYear: number;

  constructor(private dataService: DataService,
              private assessmentExamMapper: AssessmentExamMapper) {
  }

  getAvailableMeasuredAssessments(): Observable<MeasuredAssessment[]> {
    return this.dataService.get(`${ServiceRoute}/groups/${this.group.id}/measuredassessments`, {
      search: this.getSchoolYearParams(this.schoolYear)
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverAssessments => this.mapMeasuredAssessmentsFromApi(serverAssessments))
    );
  }

  private getSchoolYearParams(schoolYear): URLSearchParams {
    const params: URLSearchParams = new URLSearchParams();
    params.set('schoolYear', schoolYear.toString());
    return params;
  }

  mapMeasuredAssessmentsFromApi(serverAssessments: any[]): MeasuredAssessment[] {
    return serverAssessments
      .map(serverAssessment => this.mapMeasuredAssessmentFromApi(serverAssessment));
  }

  mapMeasuredAssessmentFromApi(serverAssessment: any): MeasuredAssessment {
    return <MeasuredAssessment>{
      assessment: this.assessmentExamMapper.mapAssessmentFromApi(serverAssessment.assessment),
      averageScaleScore: serverAssessment.measures.avgScaleScore,
      averageStandardError: serverAssessment.measures.avgStdErr,
      date: serverAssessment.completedAt,
      studentsTested: serverAssessment.studentsTested,
      studentCountByPerformanceLevel: [
        serverAssessment.measures.level1Count,
        serverAssessment.measures.level2Count,
        serverAssessment.measures.level3Count
      ]
    };
  }


}
