import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ResponseUtils } from '../shared/response-utils';
import { Injectable } from '@angular/core';
import { ReportingServiceRoute } from '../shared/service-route';
import { DataService } from '../shared/data/data.service';
import { URLSearchParams } from '@angular/http';
import { Group } from '../groups/group';
import { AssessmentExamMapper } from '../assessments/assessment-exam.mapper';
import { DetailsByPerformanceLevel, MeasuredAssessment } from './measured-assessment';

const ServiceRoute = ReportingServiceRoute;

@Injectable()
export class GroupDashboardService {

  constructor(private dataService: DataService,
              private assessmentExamMapper: AssessmentExamMapper) {
  }

  getAvailableMeasuredAssessments(group: Group, schoolYear: number): Observable<MeasuredAssessment[]> {
    return this.dataService.get(`${ServiceRoute}/groups/${group.id}/measuredassessments`, {
      search: this.getSchoolYearParams(schoolYear)
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
        <DetailsByPerformanceLevel>{
          studentCount: serverAssessment.measures.level1Count,
          percent: (serverAssessment.measures.level1Count / serverAssessment.studentsTested) * 100
        },
        <DetailsByPerformanceLevel>{
          studentCount: serverAssessment.measures.level2Count,
          percent: (serverAssessment.measures.level2Count / serverAssessment.studentsTested) * 100
        },
        <DetailsByPerformanceLevel>{
          studentCount: serverAssessment.measures.level3Count,
          percent: (serverAssessment.measures.level3Count / serverAssessment.studentsTested) * 100
        }
      ]
    };
  }


}
