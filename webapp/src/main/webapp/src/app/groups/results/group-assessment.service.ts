import { Injectable } from '@angular/core';
import { AssessmentExamMapper } from '../../assessments/assessment-exam.mapper';
import { ExamFilterOptionsService } from '../../assessments/filters/exam-filters/exam-filter-options.service';
import { ResponseUtils } from '../../shared/response-utils';
import { DataService } from '../../shared/data/data.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ReportingServiceRoute } from '../../shared/service-route';

const ServiceRoute = ReportingServiceRoute;

export interface Search {
  readonly groupId?: number;
  readonly userGroupId?: number;
  readonly schoolId?: number; // use later
  readonly schoolYear: number;
}

export interface ExamSearch extends Search {
  readonly assessmentId?: number;
}

export interface ExamItemSearch extends ExamSearch {
  readonly itemTypes?: string[];
}

@Injectable()
export class GroupAssessmentService {

  constructor(private dataService: DataService,
              private filterOptionService: ExamFilterOptionsService,
              private mapper: AssessmentExamMapper) {
  }

  getMostRecentAssessment(search: Search) {
    if (search.schoolYear == null) {
      return this.filterOptionService.getExamFilterOptions().pipe(
        mergeMap(({ schoolYears }) => this.getRecentAssessmentBySchoolYear(
          Object.assign({}, search, { schoolYear: schoolYears[ 0 ] }))
        )
      );
    }
    return this.getRecentAssessmentBySchoolYear(search);
  }

  getAvailableAssessments(search: Search) {
    return this.dataService.get(`${ServiceRoute}/assessments`, {
      params: <any>search
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverAssessments => this.mapper.mapAssessmentsFromApi(serverAssessments))
    );
  }

  getExams(search: ExamSearch) {
    return this.dataService.get(`${ServiceRoute}/exams`, {
      params: <any>search
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverExams => this.mapper.mapExamsFromApi(serverExams))
    );
  }

  getTargetScoreExams(groupId: number, schoolYear: number, assessmentId: number) {
    return this.dataService.get(`${ServiceRoute}/examsWithTargetScores`, {
      params: {
        assessmentId: assessmentId,
        groupId: groupId,
        schoolYear: schoolYear
      }
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverTargetScoreExams => this.mapper.mapTargetScoreExamsFromApi(serverTargetScoreExams))
    );

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

  getAssessmentItems(search: ExamItemSearch) {
    return this.dataService.get(`${ServiceRoute}/examitems`, {
      params: <any>search
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverAssessmentItems => this.mapper.mapAssessmentItemsFromApi(serverAssessmentItems))
    );
  }

  private getRecentAssessmentBySchoolYear(search: Search) {
    return this.dataService.get(`${ServiceRoute}/latestassessment`, {
      search: <any>search
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

}
