import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { URLSearchParams } from "@angular/http";
import { DataService } from "../../../shared/data/data.service";
import { AssessmentExamMapper } from "../../../assessments/assessment-exam.mapper";
import { ExamFilterOptionsService } from "../../../assessments/filters/exam-filters/exam-filter-options.service";

@Injectable()
export class AssessmentService {
  constructor(private dataService: DataService, private filterOptionService: ExamFilterOptionsService, private mapper: AssessmentExamMapper) {
  }

  getMostRecentAssessment(groupId: number, schoolYear?: number) {
    if (schoolYear == undefined) {
      return this.filterOptionService.getExamFilterOptions().mergeMap(options => {
        return this.getRecentAssessmentBySchoolYear(groupId, options.schoolYears[ 0 ]);
      });
    }
    else {
      return this.getRecentAssessmentBySchoolYear(groupId, schoolYear);
    }
  }

  getAvailableAssessments(groupId: number, schoolYear: number) {
    return this.dataService.get(`/groups/${groupId}/assessments`, { search: this.getSchoolYearParams(schoolYear) })
      .catch(response => {
        console.warn(response);
        return Observable.empty();
      })
      .map(x => {
        return this.mapper.mapAssessmentsFromApi(x);
      });
  }

  getExams(groupId: number, schoolYear: number, assessmentId: number) {
    return this.dataService.get(`/groups/${groupId}/assessments/${assessmentId}/exams`, { search: this.getSchoolYearParams(schoolYear) })
      .catch(response => {
        console.warn(response);
        return Observable.empty();
      })
      .map(x => {
        return this.mapper.mapExamsFromApi(x);
      });
  }

  getExamItems(groupId: number, schoolYear: number, assessmentId: number) {
    return this.dataService.get(`/groups/${groupId}/assessments/${assessmentId}/examitems`, { search: this.getSchoolYearParams(schoolYear) })
      .catch(response => {
        console.warn(response);
        return Observable.empty();
      })
      .map(x => {
        return this.mapper.mapAssessmentItemsFromApi(x);
      });
  }

  private getRecentAssessmentBySchoolYear(groupId: number, schoolYear: number) {
    return this.dataService.get(`/groups/${groupId}/latestassessment`, { search: this.getSchoolYearParams(schoolYear) })
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
