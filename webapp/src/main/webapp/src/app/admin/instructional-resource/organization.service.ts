import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Organization } from "./model/organization.model";
import { OrganizationQuery } from "./model/organization-query.model";
import { DataService } from "../../shared/data/data.service";
import { map } from 'rxjs/operators';
import { AdminServiceRoute } from '../../shared/service-route';

const ResourceContext = `${AdminServiceRoute}/organizations`;


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
    return this.dataService.get(`${ResourceContext}`, { params: query })
      .pipe(
        map(OrganizationService.mapOrganizationsFromApi)
      );
  }

  private static mapOrganizationsFromApi(serverOrganizations: any[]): Organization[] {
    return serverOrganizations.map(serverOrganization => OrganizationService.mapOrganizationFromApi(serverOrganization));
  }

  private static mapOrganizationFromApi(serverOrganization: any): Organization {
    const organization: Organization = new Organization();
    organization.id = serverOrganization.id;
    organization.name = serverOrganization.name;
    organization.organizationType = serverOrganization.organizationType;
    organization.naturalId = serverOrganization.naturalId;
    return organization;
  }

}
