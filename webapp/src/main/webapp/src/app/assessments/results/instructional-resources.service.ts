import { Injectable } from "@angular/core";
import { CachingDataService } from "@sbac/rdw-reporting-common-ngx";
import { ResponseUtils } from "../../shared/response-utils";
import { Observable } from "rxjs/Observable";
import { InstructionalResource, InstructionalResources } from "../model/instructional-resources.model";
import { URLSearchParams } from '@angular/http';

@Injectable()
export class InstructionalResourcesService {
  constructor(private dataService: CachingDataService) {
  }

  getInstructionalResources(assessmentId: number, schoolId: number): Observable<InstructionalResources> {
    let params: URLSearchParams = new URLSearchParams();

    params.set('assessmentId', assessmentId.toString());
    params.set('schoolId', schoolId.toString());
    return this.dataService.get(`/instructional-resources`, { params: params })
      .catch(ResponseUtils.badResponseToNull)
      .map(instructionalResources => {
        if (instructionalResources === null || instructionalResources.length === 0) return null;
        return InstructionalResourcesService.mapInstructionalResourcesFromApi(instructionalResources);
      });
  }

  private static mapInstructionalResourcesFromApi(apiModel): InstructionalResources {
    let uiModels = new Map<number, InstructionalResource[]>();

    for (let apiInstructionalResource of apiModel) {
      if (!uiModels.has(apiInstructionalResource.performanceLevel)) {
        uiModels.set(apiInstructionalResource.performanceLevel, []);
      }
      uiModels.get(apiInstructionalResource.performanceLevel).push(InstructionalResourcesService.mapInstructionalResourceFromApi(apiInstructionalResource));
    }

    return new InstructionalResources(uiModels);
  }

  private static mapInstructionalResourceFromApi(apiModel): InstructionalResource {
    let instructionalResource = new InstructionalResource();
    instructionalResource.organizationLevel = apiModel.organizationLevel;
    instructionalResource.organizationName = apiModel.organizationName;
    instructionalResource.performanceLevel = apiModel.performanceLevel;
    instructionalResource.url = apiModel.resource;
    return instructionalResource;
  }
}
