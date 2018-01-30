import { Injectable } from "@angular/core";
import { URLSearchParams } from "@angular/http";
import { AssessmentExamMapper } from "../../assessments/assessment-exam.mapper";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { AssessmentProvider } from "../../assessments/assessment-provider.interface";
import { ResponseUtils } from "../../shared/response-utils";
import { Grade } from "../grade.model";
import { DataService } from "../../shared/data/data.service";
import { Utils } from "../../shared/support/support";

const ServiceRoute = '/reporting-service';

@Injectable()
export class SchoolAssessmentService implements AssessmentProvider {

  schoolId: number;
  schoolName: string;
  grade: Grade;
  schoolYear: number;

  constructor(private dataService: DataService,
              private filterOptionService: ExamFilterOptionsService,
              private mapper: AssessmentExamMapper) {
  }

  getMostRecentAssessment(schoolId: number, gradeId :number, schoolYear?: number) {
    if (Utils.isNullOrUndefined(schoolYear)) {
      return this.filterOptionService.getExamFilterOptions().mergeMap(options => {
        return this.getRecentAssessmentBySchoolYear(schoolId, gradeId, options.schoolYears[ 0 ]);
      });
    }
    return this.getRecentAssessmentBySchoolYear(schoolId, gradeId, schoolYear);
  }

  getAvailableAssessments() {
    return this.dataService.get(`${ServiceRoute}/schools/${this.schoolId}/assessmentGrades/${this.grade.id}/assessments`, { search: this.getSchoolYearParams(this.schoolYear) })
      .catch(ResponseUtils.badResponseToNull)
      .map(x => {
        return this.mapper.mapAssessmentsFromApi(x);
      });
  }

  getExams(assessmentId: number) {
    return this.dataService.get(`${ServiceRoute}/schools/${this.schoolId}/assessmentGrades/${this.grade.id}/assessments/${assessmentId}/exams`, { search: this.getSchoolYearParams(this.schoolYear) })
      .catch(ResponseUtils.badResponseToNull)
      .map(x => {
        return this.mapper.mapExamsFromApi(x);
      });
  }

  getSchoolId() {
    return this.schoolId;
  }

  getAssessmentItems(assessmentId: number, itemTypes?: string[]) {
      return this.dataService.get(`${ServiceRoute}/schools/${this.schoolId}/assessmentGrades/${this.grade.id}/assessments/${assessmentId}/examitems`, {
          params: {
            types: itemTypes,
            schoolYear: this.schoolYear.toString()
          }
        })
        .catch(ResponseUtils.badResponseToNull)
        .map(x => {
          return this.mapper.mapAssessmentItemsFromApi(x);
        });
  }

  private getRecentAssessmentBySchoolYear(schoolId: number, gradeId: number, schoolYear: number) {
    return this.dataService.get(`${ServiceRoute}/schools/${schoolId}/assessmentGrades/${gradeId}/latestassessment`, { search: this.getSchoolYearParams(schoolYear) })
      .catch(ResponseUtils.badResponseToNull)
      .map(x => {
        if (x == null) {
          return x;
        }
        return this.mapper.mapFromApi(x);
      });
  }

  private getSchoolYearParams(schoolYear: number): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();
    params.set('schoolYear', schoolYear.toString());
    return params;
  }

}
