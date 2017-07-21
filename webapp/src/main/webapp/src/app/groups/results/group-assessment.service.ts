import { Injectable } from "@angular/core";
import { URLSearchParams } from "@angular/http";
import { DataService } from "../../shared/data/data.service";
import { AssessmentExamMapper } from "../../assessments/assessment-exam.mapper";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { AssessmentProvider } from "../../assessments/assessment-provider.interface";
import { ResponseUtils } from "../../shared/response-utils";

@Injectable()
export class GroupAssessmentService implements AssessmentProvider {
  groupId: number;
  schoolYear: number;

  constructor(private dataService: DataService, private filterOptionService: ExamFilterOptionsService, private mapper: AssessmentExamMapper) {
  }

  getMostRecentAssessment(groupId:number, schoolYear?: number) {
    if (schoolYear == undefined) {
      return this.filterOptionService.getExamFilterOptions().mergeMap(options => {
        return this.getRecentAssessmentBySchoolYear(groupId, options.schoolYears[ 0 ]);
      });
    }
    else {
      return this.getRecentAssessmentBySchoolYear(groupId, schoolYear);
    }
  }

  getAvailableAssessments() {
    return this.dataService.get(`/groups/${this.groupId}/assessments`, { search: this.getSchoolYearParams(this.schoolYear) })
      .catch(ResponseUtils.notFoundToEmptyArray)
      .map(x => {
        return this.mapper.mapAssessmentsFromApi(x);
      });
  }

  getExams(assessmentId: number) {
    return this.dataService.get(`/groups/${this.groupId}/assessments/${assessmentId}/exams`, { search: this.getSchoolYearParams(this.schoolYear) })
      .catch(ResponseUtils.notFoundToEmptyArray)
      .map(x => {
        return this.mapper.mapExamsFromApi(x);
      });
  }

  getAssessmentItems(assessmentId: number) {
    return this.dataService.get(`/groups/${this.groupId}/assessments/${assessmentId}/examitems`, { search: this.getSchoolYearParams(this.schoolYear) })
      .catch(ResponseUtils.notFoundToEmptyArray)
      .map(x => {
        return this.mapper.mapAssessmentItemsFromApi(x);
      });
  }

  private getRecentAssessmentBySchoolYear(groupId: number, schoolYear: number) {
    return this.dataService.get(`/groups/${groupId}/latestassessment`, { search: this.getSchoolYearParams(schoolYear) })
      .catch(ResponseUtils.notFoundToNull)
      .map(x => {
        if (x == null) return null;

        return this.mapper.mapFromApi(x);
      });
  }

  private getSchoolYearParams(schoolYear): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();
    params.set('schoolYear', schoolYear.toString());
    return params;
  }
}
