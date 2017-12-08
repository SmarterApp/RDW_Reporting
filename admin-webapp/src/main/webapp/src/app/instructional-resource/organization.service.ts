import { Injectable } from "@angular/core";
import { DataService } from "@sbac/rdw-reporting-common-ngx";
import { Observable } from "rxjs/Observable";
import { Organization } from "./model/organization.model";
import { OrganizationQuery } from "./model/organization-query.model";

/**
 * This service is responsible for interacting with organizations.
 */
@Injectable()
export class OrganizationService {

  constructor(private dataService: DataService) {
  }

  /**
   * Find organizations for the given query.
   *
   * @param {OrganizationQuery} query An organization query
   * @returns {Observable<Organization[]>}  The matching organizations
   */
  find(query: OrganizationQuery): Observable<Organization[]> {
    return this.dataService.get("/organizations", {params: query})
      .map(OrganizationService.mapOrganizationsFromApi);
  }

  private static mapOrganizationsFromApi(apiModels): Organization[] {
    return apiModels.map(x => OrganizationService.mapOrganizationFromApi(x));
  }

  private static mapOrganizationFromApi(apiModel: any): Organization {
    let uiModel: Organization = new Organization();

    uiModel.id = apiModel.id;
    uiModel.name = apiModel.name;
    uiModel.organizationType = apiModel.organizationType;
    uiModel.naturalId = apiModel.naturalId;
    return uiModel;
  }
}
