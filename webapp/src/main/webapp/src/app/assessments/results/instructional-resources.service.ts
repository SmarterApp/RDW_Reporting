import { Injectable } from "@angular/core";
import { ResponseUtils } from "../../shared/response-utils";
import { Observable } from "rxjs/Observable";
import { InstructionalResource, InstructionalResources } from "../model/instructional-resources.model";
import { URLSearchParams } from '@angular/http';
import { DataService } from "../../shared/data/data.service";
import { of } from 'rxjs/observable/of';
import { catchError, map } from 'rxjs/operators';

const ServiceRoute = '/reporting-service';

@Injectable()
export class InstructionalResourcesService {

  private resourcesBySchoolAssessment: { [key: string]: any } = {};

  constructor(private dataService: DataService) {
  }

  getInstructionalResources(assessmentId: number, schoolId: number): Observable<InstructionalResources> {
    const cacheKey: string = InstructionalResourcesService.getKey(assessmentId, schoolId);

    // Return cached value
    if (this.resourcesBySchoolAssessment.hasOwnProperty(cacheKey)) {
      return of(this.resourcesBySchoolAssessment[ cacheKey ]);
    }

    const params: URLSearchParams = new URLSearchParams();
    params.set('assessmentId', assessmentId.toString());
    params.set('schoolId', schoolId.toString());

    return this.dataService.get(`${ServiceRoute}/instructional-resources`, { params: params })
      .pipe(
        catchError(ResponseUtils.badResponseToNull),
        map(instructionalResources => {
          const resources: InstructionalResources = (!instructionalResources || instructionalResources.length === 0)
            ? new InstructionalResources(new Map())
            : InstructionalResourcesService.mapInstructionalResourcesFromApi(instructionalResources);

          //Cache response
          this.resourcesBySchoolAssessment[ cacheKey ] = resources;
          return resources;
        })
      );
  }

  private static mapInstructionalResourcesFromApi(serverResources: any[]): InstructionalResources {
    const resourcesById = new Map<number, InstructionalResource[]>();

    for (let serverResource of serverResources) {
      if (!resourcesById.has(serverResource.performanceLevel)) {
        resourcesById.set(serverResource.performanceLevel, []);
      }
      resourcesById.get(serverResource.performanceLevel).push(InstructionalResourcesService.mapInstructionalResourceFromApi(serverResource));
    }

    return new InstructionalResources(resourcesById);
  }

  private static mapInstructionalResourceFromApi(serverResource: any): InstructionalResource {
    const resource = new InstructionalResource();
    resource.organizationLevel = serverResource.organizationLevel;
    resource.organizationName = serverResource.organizationName;
    resource.performanceLevel = serverResource.performanceLevel.toString();
    resource.url = serverResource.resource;
    return resource;
  }

  private static getKey(assessmentId: number, schoolId: number): string {
    return `${assessmentId}|${schoolId}`;
  }

}
