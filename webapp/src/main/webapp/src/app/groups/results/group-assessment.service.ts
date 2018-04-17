import { Injectable } from "@angular/core";
import { URLSearchParams } from "@angular/http";
import { AssessmentExamMapper } from "../../assessments/assessment-exam.mapper";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { AssessmentProvider } from "../../assessments/assessment-provider.interface";
import { ResponseUtils } from "../../shared/response-utils";
import { Group } from "../group";
import { DataService } from "../../shared/data/data.service";
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ReportingServiceRoute } from '../../shared/service-route';

const ServiceRoute = ReportingServiceRoute;

@Injectable()
export class GroupAssessmentService implements AssessmentProvider {

  group: Group;
  schoolYear: number;

  constructor(private dataService: DataService,
              private filterOptionService: ExamFilterOptionsService,
              private mapper: AssessmentExamMapper) {
  }

  getMostRecentAssessment(groupId: number, schoolYear?: number) {
    if (schoolYear == undefined) {
      return this.filterOptionService.getExamFilterOptions()
        .pipe(
          mergeMap(options => this.getRecentAssessmentBySchoolYear(groupId, options.schoolYears[ 0 ]))
        );
    }
    return this.getRecentAssessmentBySchoolYear(groupId, schoolYear);
  }

  getAvailableAssessments() {
    return this.dataService.get(`${ServiceRoute}/groups/${this.group.id}/measuredassessments`, {
      search: this.getSchoolYearParams(this.schoolYear)
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverAssessments => this.mapper.mapMeasuredAssessmentsFromApi(serverAssessments))
    );
  }

  getExams(assessmentId: number) {
    return this.dataService.get(`${ServiceRoute}/groups/${this.group.id}/assessments/${assessmentId}/exams`, {
      search: this.getSchoolYearParams(this.schoolYear)
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverExams => this.mapper.mapExamsFromApi(serverExams))
    );
  }

  getAssessmentItems(assessmentId: number, itemTypes?: string[]) {
    return this.dataService.get(`${ServiceRoute}/groups/${this.group.id}/assessments/${assessmentId}/examitems`, {
      params: {
        types: itemTypes,
        schoolYear: this.schoolYear.toString()
      }
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverAssessmentItems => this.mapper.mapAssessmentItemsFromApi(serverAssessmentItems))
    );
  }

  getSchoolId() {
    return this.group.schoolId;
  }

  private getRecentAssessmentBySchoolYear(groupId: number, schoolYear: number) {
    return this.dataService.get(`${ServiceRoute}/groups/${groupId}/latestassessment`, {
      search: this.getSchoolYearParams(schoolYear)
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverAssessment => {
        if (serverAssessment == null) {
          return null;
        }
        return this.mapper.mapFromApi(serverAssessment);
      })
    );
  }

  private getSchoolYearParams(schoolYear): URLSearchParams {
    const params: URLSearchParams = new URLSearchParams();
    params.set('schoolYear', schoolYear.toString());
    return params;
  }

}
