import { DataService } from "@sbac/rdw-reporting-common-ngx";
import { Injectable } from "@angular/core";
import { InstructionalResource } from "./model/instructional-resource.model";
import { Observable } from "rxjs/Observable";

const ServiceRoute = '/admin-service';

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
    return this.dataService.get(`${ServiceRoute}/instructional-resources`)
      .map(InstructionalResourceService.mapResourcesFromApi);
  }

  /**
   * Create an instructional resource.
   *
   * @param {InstructionalResource} resource  The instructional resource to create
   * @returns {Observable<InstructionalResource>} The created instructional resource
   */
  create(resource: InstructionalResource): Observable<InstructionalResource> {
    return this.dataService.post(`${ServiceRoute}/instructional-resources`, resource)
      .map(InstructionalResourceService.mapResourceFromApi);
  }

  /**
   * Update an instructional resource's url.
   *
   * @param {InstructionalResource} resource The updated instructional resource
   * @returns {Observable<InstructionalResource>} The updated instructional resource
   */
  update(resource: InstructionalResource): Observable<InstructionalResource> {
    return this.dataService.put(`${ServiceRoute}/instructional-resources`, resource)
      .map(InstructionalResourceService.mapResourceFromApi);
  }

  /**
   * Delete the given instructional resource.
   *
   * @param {InstructionalResource} resource  An instructional resource
   * @returns {Observable<any>} Empty if the action was successful
   */
  delete(resource: InstructionalResource): Observable<any> {
    return this.dataService.delete(`${ServiceRoute}/instructional-resources`, {params: resource});
  }

  private static mapResourcesFromApi(apiModels) {
    return apiModels.map(apiModel => InstructionalResourceService.mapResourceFromApi(apiModel));
  }

  private static mapResourceFromApi(apiModel): InstructionalResource {
    let uiModel: InstructionalResource = new InstructionalResource();
    uiModel.organizationId = apiModel.organizationId;
    uiModel.organizationName = apiModel.organizationName;
    uiModel.organizationType = apiModel.organizationType;
    uiModel.assessmentLabel = apiModel.assessmentLabel;
    uiModel.assessmentName = apiModel.assessmentName;
    uiModel.assessmentType = apiModel.assessmentType;
    uiModel.resource = apiModel.resource;
    uiModel.performanceLevel = apiModel.performanceLevel;
    return uiModel;
  }
}
