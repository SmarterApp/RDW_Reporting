import { Injectable } from "@angular/core";
import { AssessmentExamMapper } from "../../assessments/assessment-exam.mapper";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { AssessmentProvider } from "../../assessments/assessment-provider.interface";
import { ResponseUtils } from "../../shared/response-utils";
import { Grade } from "../grade.model";
import { DataService } from "../../shared/data/data.service";
import { Utils } from "../../shared/support/support";
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AssessmentExam } from '../../assessments/model/assessment-exam.model';
import { Observable } from 'rxjs/Observable';
import { Assessment } from '../../assessments/model/assessment.model';
import { Exam } from '../../assessments/model/exam.model';
import { AssessmentItem } from '../../assessments/model/assessment-item.model';
import { ReportingServiceRoute } from '../../shared/service-route';
import { of } from 'rxjs/observable/of';
import { TargetScoreExam } from '../../assessments/model/target-score-exam.model';

const ServiceRoute = ReportingServiceRoute;

@Injectable()
export class SchoolAssessmentService implements AssessmentProvider {

  schoolId: number;
  grade: Grade;
  schoolYear: number;

  constructor(private dataService: DataService,
              private filterOptionService: ExamFilterOptionsService,
              private mapper: AssessmentExamMapper) {
  }

  getMostRecentAssessment(schoolId: number, gradeId: number, schoolYear?: number): Observable<AssessmentExam> {
    if (Utils.isNullOrUndefined(schoolYear)) {
      return this.filterOptionService.getExamFilterOptions().pipe(
        mergeMap(options => this.getRecentAssessmentBySchoolYear(schoolId, gradeId, options.schoolYears[ 0 ]))
      );
    }
    return this.getRecentAssessmentBySchoolYear(schoolId, gradeId, schoolYear);
  }

  getAvailableAssessments(): Observable<Assessment[]> {
    return this.dataService.get(`${ServiceRoute}/schools/${this.schoolId}/assessmentGrades/${this.grade.id}/assessments`, {
      search: this.getSchoolYearParams(this.schoolYear)
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverAssessments => this.mapper.mapAssessmentsFromApi(serverAssessments))
    );
  }

  getExams(assessmentId: number): Observable<Exam[]> {
    return this.dataService.get(`${ServiceRoute}/schools/${this.schoolId}/assessmentGrades/${this.grade.id}/assessments/${assessmentId}/exams`, {
      search: this.getSchoolYearParams(this.schoolYear)
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverExams => this.mapper.mapExamsFromApi(serverExams))
    );
  }

  getSchoolId() {
    return this.schoolId;
  }

  getAssessmentItems(assessmentId: number, itemTypes?: string[]): Observable<AssessmentItem[]> {
    return this.dataService.get(`${ServiceRoute}/schools/${this.schoolId}/assessmentGrades/${this.grade.id}/assessments/${assessmentId}/examitems`, {
      params: {
        types: itemTypes,
        schoolYear: this.schoolYear.toString()
      }
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverAssessments => this.mapper.mapAssessmentItemsFromApi(serverAssessments))
    );
  }

  getTargetScoreExams(assessmentId: number): Observable<TargetScoreExam[]> {
    return of([]);
  }

  private getRecentAssessmentBySchoolYear(schoolId: number, gradeId: number, schoolYear: number): Observable<AssessmentExam> {
    return this.dataService.get(`${ServiceRoute}/schools/${schoolId}/assessmentGrades/${gradeId}/latestassessment`, {
      search: this.getSchoolYearParams(schoolYear)
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverAssessment => {
        if (serverAssessment == null) {
          return null;
        }
        return this.mapper.mapFromApi(serverAssessment)
      })
    );
  }

  private getSchoolYearParams(schoolYear: number): any {
    return {
      schoolYear: schoolYear
    };
  }

}
