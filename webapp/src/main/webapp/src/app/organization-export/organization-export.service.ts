import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { Organization } from "./organization/organization";
import { UserOrganizations } from "./organization/user-organizations";
import { OrganizationExportOptions } from "./organization-export-options";
import { OrganizationExportNamingService } from "./organization-export-naming.service";
import { OrganizationGroupingService } from "./organization-grouping.service";
import { DataService } from "../shared/data/data.service";

const ServiceRoute = '/report-processor';

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
   * @param {boolean} disableTransferAccess true to exclude transfer student exams from other schools
   * @returns {Observable<void>}
   */
  createExport(schoolYear: number, schools: Organization[], disableTransferAccess: boolean, organizations: UserOrganizations): Observable<void> {
    return this.dataService.post(`${ServiceRoute}/exams/export`, this.createExportRequest(schoolYear, schools, disableTransferAccess, organizations))
  }

  private createExportRequest(schoolYear: number, schools: Organization[], disableTransferAccess: boolean, organizations: UserOrganizations): OrganizationExportRequest {
    let ids = this.groupingService.groupSelectedOrganizationIdsByType(schools, organizations);
    let options = Object.assign({ schoolYear: schoolYear }, ids);
    let name = this.namingService.name(options, organizations);
    options = Object.assign({ disableTransferAccess: disableTransferAccess}, options);
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
