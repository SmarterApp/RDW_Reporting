import { Injectable } from "@angular/core";
import { DataService } from "@sbac/rdw-reporting-common-ngx";
import { InstructionalResourcesMapper } from "./instructional-resources.mapper";
import { ResponseUtils } from "../../shared/response-utils";
import { Observable } from "rxjs/Observable";
import { InstructionalResources } from "../model/instructional-resources.model";
import { CachingDataService } from "@sbac/rdw-reporting-common-ngx";
import {URLSearchParams} from '@angular/http';

@Injectable()
export class InstructionalResourcesService {
  constructor(private dataService: CachingDataService, private instructionalResourcesMapper: InstructionalResourcesMapper) {
  }

// taken from SchoolAssessmentService
  getInstructionalResources(assessmentId: number, schoolId: number): Observable<InstructionalResources> {
    let params: URLSearchParams = new URLSearchParams();

    params.set('assessmentId', assessmentId.toString());
    params.set('schoolId', schoolId.toString());
    return this.dataService.get(`/instructional-resources`, { params: params })
      .catch(ResponseUtils.badResponseToNull)
      .map(instructionalResources => {
        if (instructionalResources === null || instructionalResources.length === 0) return null;
        return this.instructionalResourcesMapper.mapInstructionalResourcesFromApi(instructionalResources);
      });
  }
}
