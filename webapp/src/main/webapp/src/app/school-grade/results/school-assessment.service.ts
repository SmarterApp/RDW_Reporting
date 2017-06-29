import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { URLSearchParams } from "@angular/http";
import { DataService } from "../../shared/data/data.service";
import { AssessmentExamMapper } from "../../assessments/assessment-exam.mapper";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { AssessmentProvider } from "../../assessments/assessment-provider.interface";

@Injectable()
export class SchoolAssessmentService implements AssessmentProvider {
  schoolId: number;
  gradeId: number;
  schoolYear: number;

  constructor(private dataService: DataService, private filterOptionService: ExamFilterOptionsService, private mapper: AssessmentExamMapper) {
  }

  getMostRecentAssessment(schoolId: number, gradeId :number, schoolYear?: number) {
    if (schoolYear == undefined) {
      return this.filterOptionService.getExamFilterOptions().mergeMap(options => {
        return this.getRecentAssessmentBySchoolYear(schoolId, gradeId, options.schoolYears[ 0 ]);
      });
    }
    else {
      return this.getRecentAssessmentBySchoolYear(schoolId, gradeId, schoolYear);
    }
  }

  getAvailableAssessments() {
    return this.dataService.get(`/schools/${this.schoolId}/assessmentGrades/${this.gradeId}/assessments`, { search: this.getSchoolYearParams(this.schoolYear) })
      .catch(response => {
        console.warn(response);
        return Observable.empty();
      })
      .map(x => {
        return this.mapper.mapAssessmentsFromApi(x);
      });
  }

  getExams(assessmentId: number) {
    return this.dataService.get(`/schools/${this.schoolId}/assessmentGrades/${this.gradeId}/exams`, { search: this.getSchoolYearParams(this.schoolYear) })
      .catch(response => {
        console.warn(response);
        return Observable.empty();
      })
      .map(x => {
        return this.mapper.mapExamsFromApi(x);
      });
  }

  getAssessmentItems(assessmentId: number) {
    return this.dataService.get(`/schools/${this.schoolId}/assessmentGrades/${this.gradeId}/examitems`, { search: this.getSchoolYearParams(this.schoolYear) })
      .catch(response => {
        console.warn(response);
        return Observable.empty();
      })
      .map(x => {
        return this.mapper.mapAssessmentItemsFromApi(x);
      });
  }

  private getRecentAssessmentBySchoolYear(schoolId: number, gradeId: number, schoolYear: number) {
    return this.dataService.get(`/schools/${schoolId}/assessmentGrades/${gradeId}/latestassessment`, { search: this.getSchoolYearParams(schoolYear) })
      .catch(response => {
        console.warn(response);
        return Observable.empty();
      })
      .map(x => {
        return this.mapper.mapFromApi(x);
      });
  }

  private getSchoolYearParams(schoolYear): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();
    params.set('schoolYear', schoolYear.toString());
    return params;
  }
}
