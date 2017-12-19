import { Observable } from "rxjs/Observable";
import { DataService } from "@sbac/rdw-reporting-common-ngx";
import { Injectable } from "@angular/core";
import { Organization } from "./organization/organization";
import { UserOrganizations } from "./organization/user-organizations";
import { OrganizationExportOptions } from "./organization-export-options";
import { OrganizationExportNamingService } from "./organization-export-naming.service";
import { OrganizationGroupingService } from "./organization-grouping.service";

const ServiceRoute = '/reporting-service';

@Injectable()
export class OrganizationExportService {

  constructor(private dataService: DataService,
              private groupingService: OrganizationGroupingService,
              private namingService: OrganizationExportNamingService) {
  }

  /**
   * Submits a request to create a organization scoped exam CSV export.
   *
   * @param {number} schoolYear the school year to filter exam results on
   * @param {Organization[]} schools the schools to filter exam results on
   * @param {UserOrganizations} organizations all organizations available to the user
   * @returns {Observable<void>}
   */
  createExport(schoolYear: number, schools: Organization[], organizations: UserOrganizations): Observable<void> {
    return this.dataService.post(`${ServiceRoute}/exams/export`, this.createExportRequest(schoolYear, schools, organizations))
  }

  private createExportRequest(schoolYear: number, schools: Organization[], organizations: UserOrganizations): OrganizationExportRequest {
    let ids = this.groupingService.groupSelectedOrganizationIdsByType(schools, organizations);
    let options = Object.assign({ schoolYear: schoolYear }, ids);
    let name = this.namingService.name(options, organizations);
    return Object.assign({ name: name }, options);
  }

}

/**
 * Represents an organization export request and holds different exam result filter options
 */
interface OrganizationExportRequest extends OrganizationExportOptions {

  /**
   * The export file name
   */
  readonly name: string;

}
