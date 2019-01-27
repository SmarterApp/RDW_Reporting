import { Injectable } from '@angular/core';
import { InstructionalResource } from './model/instructional-resource.model';
import { Observable } from 'rxjs';
import { DataService } from '../../shared/data/data.service';
import { map } from 'rxjs/operators';
import { AdminServiceRoute } from '../../shared/service-route';

const ResourceContext = `${AdminServiceRoute}/instructional-resources`;

/**
 * This service is responsible for interacting with instructional resources.
 */
@Injectable()
export class InstructionalResourceService {

  constructor(private dataService: DataService) {
  }

  /**
   * Find all instructional resources that the user has permissions to interact with.
   *
   * @returns {Observable<InstructionalResource[]>} The user's instructional resources
   */
  findAll(): Observable<InstructionalResource[]> {
    return this.dataService.get(`${ResourceContext}`).pipe(
      map(InstructionalResourceService.mapResourcesFromApi)
    );
  }

  /**
   * Create an instructional resource.
   *
   * @param {InstructionalResource} resource  The instructional resource to create
   * @returns {Observable<InstructionalResource>} The created instructional resource
   */
  create(resource: InstructionalResource): Observable<InstructionalResource> {
    return this.dataService.post(`${ResourceContext}`, resource).pipe(
      map(InstructionalResourceService.mapResourceFromApi)
    );
  }

  /**
   * Update an instructional resource's url.
   *
   * @param {InstructionalResource} resource The updated instructional resource
   * @returns {Observable<InstructionalResource>} The updated instructional resource
   */
  update(resource: InstructionalResource): Observable<InstructionalResource> {
    return this.dataService.put(`${ResourceContext}`, InstructionalResourceService.toServerFormat(resource)).pipe(
      map(InstructionalResourceService.mapResourceFromApi)
    );
  }

  /**
   * Delete the given instructional resource.
   *
   * @param {InstructionalResource} resource  An instructional resource
   * @returns {Observable<any>} Empty if the action was successful
   */
  delete(resource: InstructionalResource): Observable<any> {
    return this.dataService.delete(`${ResourceContext}`, { params: <any>InstructionalResourceService.toServerFormat(resource) });
  }

  private static mapResourcesFromApi(serverResources) {
    return serverResources.map(serverResource => InstructionalResourceService.mapResourceFromApi(serverResource));
  }

  private static toServerFormat(resource: InstructionalResource): InstructionalResource {
    resource.assessmentType = AssessmentType[resource.assessmentType] ? AssessmentType[resource.assessmentType] : resource.assessmentType;
    return resource;
  }

  private static mapResourceFromApi(serverResource): InstructionalResource {
    const resource: InstructionalResource = new InstructionalResource();
    resource.organizationId = serverResource.organizationId;
    resource.organizationName = serverResource.organizationName;
    resource.organizationType = serverResource.organizationType;
    resource.assessmentLabel = serverResource.assessmentLabel;
    resource.assessmentName = serverResource.assessmentName;
    resource.assessmentType = serverResource.assessmentTypeCode;
    resource.assessmentSubjectCode = serverResource.assessmentSubjectCode;
    resource.resource = serverResource.resource;
    resource.performanceLevel = serverResource.performanceLevel;
    return resource;
  }
}

enum AssessmentType {
  iab = 'IAB',
  ica = 'ICA',
  sum = 'SUMMATIVE'
}
