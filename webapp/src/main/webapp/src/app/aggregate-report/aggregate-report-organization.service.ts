import { Injectable } from "@angular/core";
import { DataService } from "../shared/data/data.service";
import { Observable } from "rxjs/Observable";
import { Organization, OrganizationType } from "../shared/organization/organization";
import { OrganizationMapper } from "../shared/organization/organization.mapper";

const ServiceRoute = '/aggregate-service';

/**
 * Responsible for getting aggregate report organizations from the server
 */
@Injectable()
export class AggregateReportOrganizationService {

  constructor(private dataService: DataService,
              private organizationMapper: OrganizationMapper) {
  }

  getOrganizationsMatchingName(nameSearch: string): Observable<Organization[]> {
    return this.dataService
      .get(`${ServiceRoute}/organizations`, { params: { name: nameSearch } })
      .map(organizations => organizations
        .map(organization => this.organizationMapper.map(organization))
      );
  }

  getOrganizationsByIdAndType(type: OrganizationType, ids: number[]): Observable<Organization[]> {
    return this.dataService
      .get(`${ServiceRoute}/organizations`, { params: { types: type, id: ids } })
      .map(organizations => organizations
        .map(organization => this.organizationMapper.map(organization))
      );
  }

}
