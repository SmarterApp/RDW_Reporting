import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { URLSearchParams } from "@angular/http";
import { DataService } from "../../../shared/data.service";
import { CachingDataService } from "../../../shared/cachingData.service";
import { AssessmentExamMapper } from "./assessment-exam.mapper";

@Injectable()
export class AssessmentService {
  constructor(private dataService: DataService, private cachingService: CachingDataService, private mapper: AssessmentExamMapper) {
  }

  getMostRecentAssessment(groupId: number, schoolYear?: number) {
    if (schoolYear == undefined) {
      return this.cachingService.getSchoolYears().mergeMap(years => {
        return this.getRecentAssessmentBySchoolYear(groupId, years[ 0 ]);
      });
    }
    else {
      return this.getRecentAssessmentBySchoolYear(groupId, schoolYear);
    }
  }

  private getRecentAssessmentBySchoolYear(groupId: number, schoolYear: number) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('schoolYear', schoolYear.toString());

    return this.dataService.get(`/groups/${groupId}/latestassessment`, { search: params })
      .catch(response => {
        console.warn(response);
        return Observable.empty();
      })
      .map(x => {
        return this.mapper.mapFromApi(x);
      })

  }
}
