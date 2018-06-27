import { Injectable } from '@angular/core';
import { ResponseUtils } from '../../shared/response-utils';
import { Observable } from 'rxjs/Observable';
import { InstructionalResource, InstructionalResources } from '../model/instructional-resources.model';
import { URLSearchParams } from '@angular/http';
import { DataService } from '../../shared/data/data.service';
import { of } from 'rxjs/observable/of';
import { catchError, map } from 'rxjs/operators';
import { ReportingServiceRoute } from '../../shared/service-route';
import { CachingDataService } from '../../shared/data/caching-data.service';

const ServiceRoute = ReportingServiceRoute;

@Injectable()
export class InstructionalResourcesService {

  constructor(private dataService: CachingDataService) {
  }

  private createParams(assessmentId: number, schoolId: number) {
    return schoolId == null
      ? {
        params: {
          assessmentId: assessmentId
        }
      }
      : {
        params: {
          assessmentId: assessmentId,
          schoolId: schoolId
        }
      };
  }

  getInstructionalResources(assessmentId: number, schoolId: number): Observable<InstructionalResources> {
    return this.dataService.get(`${ServiceRoute}/instructional-resources`, this.createParams(assessmentId, schoolId)).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(instructionalResources => {
        return (!instructionalResources || instructionalResources.length === 0)
          ? new InstructionalResources()
          : this.mapInstructionalResourcesFromApi(instructionalResources);
      })
    );
  }

  private mapInstructionalResourcesFromApi(serverResources: any[]): InstructionalResources {
    const resourcesById = new Map<number, InstructionalResource[]>();
    for (const serverResource of serverResources) {
      const resource = this.mapInstructionalResourceFromApi(serverResource);
      const resources = resourcesById.get(serverResource.performanceLevel);
      if (resources == null) {
        resourcesById.set(serverResource.performanceLevel, [ resource ]);
      } else {
        resources.push(resource);
      }
    }
    return new InstructionalResources(resourcesById);
  }

  private mapInstructionalResourceFromApi(serverResource: any): InstructionalResource {
    const resource = new InstructionalResource();
    resource.organizationLevel = serverResource.organizationLevel;
    resource.organizationName = serverResource.organizationName;
    resource.performanceLevel = serverResource.performanceLevel.toString();
    resource.url = serverResource.resource;
    return resource;
  }

}
