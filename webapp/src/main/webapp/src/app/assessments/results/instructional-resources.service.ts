import { Injectable } from "@angular/core";
import { DataService } from "@sbac/rdw-reporting-common-ngx";
import { ResponseUtils } from "../../shared/response-utils";
import { Observable } from "rxjs/Observable";
import { InstructionalResource, InstructionalResources } from "../model/instructional-resources.model";
import { URLSearchParams } from '@angular/http';

const ServiceRoute = '/reporting-service';

@Injectable()
export class InstructionalResourcesService {
  private resourcesBySchoolAssessment: { [key: string]: any } = {};

  constructor(private dataService: DataService) {
  }

  getInstructionalResources(assessmentId: number, schoolId: number): Observable<InstructionalResources> {
    let cacheKey: string = InstructionalResourcesService.getKey(assessmentId, schoolId);

    // Return cached value
    if (this.resourcesBySchoolAssessment.hasOwnProperty(cacheKey)) {
      return Observable.of(this.resourcesBySchoolAssessment[cacheKey]);
    }

    let params: URLSearchParams = new URLSearchParams();
    params.set('assessmentId', assessmentId.toString());
    params.set('schoolId', schoolId.toString());

    return this.dataService.get(`${ServiceRoute}/instructional-resources`, { params: params })
      .catch(ResponseUtils.badResponseToNull)
      .map(instructionalResources => {
        let resources: InstructionalResources = (!instructionalResources || instructionalResources.length === 0)
          ? new InstructionalResources(new Map())
          : InstructionalResourcesService.mapInstructionalResourcesFromApi(instructionalResources);

        //Cache response
        this.resourcesBySchoolAssessment[cacheKey] = resources;
        return resources;
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
    instructionalResource.performanceLevel = apiModel.performanceLevel.toString();
    instructionalResource.url = apiModel.resource;
    return instructionalResource;
  }

  private static getKey(assessmentId: number, schoolId: number): string {
    return assessmentId + "|" + schoolId;
  }
}
