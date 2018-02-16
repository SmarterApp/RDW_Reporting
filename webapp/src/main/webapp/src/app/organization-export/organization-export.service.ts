import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { Organization } from "./organization/organization";
import { UserOrganizations } from "./organization/user-organizations";
import { OrganizationExportOptions } from "./organization-export-options";
import { OrganizationGroupingService } from "./organization-grouping.service";
import { DataService } from "../shared/data/data.service";

const ServiceRoute = '/report-processor';

@Injectable()
export class OrganizationExportService {

  constructor(private dataService: DataService,
              private groupingService: OrganizationGroupingService) {
  }

  /**
   * Submits a request to create a organization scoped exam CSV export.
   *
   * @param {OrganizationExport} orgExport The export request
   * @returns {Observable<void>}
   */
  createExport(orgExport: OrganizationExport): Observable<void> {
    return this.dataService.post(`${ServiceRoute}/exams/export`, this.createExportRequest(orgExport))
  }

  private createExportRequest(orgExport: OrganizationExport): OrganizationExportRequest {
    return Object.assign( {
      name: orgExport.name,
      schoolYear: orgExport.schoolYear,
      disableTransferAccess: orgExport.disableTransferAccess,
    }, this.groupingService.groupSelectedOrganizationIdsByType(orgExport.schools, orgExport.organizations));
  }

}

export interface OrganizationExport {
  name?: string;
  schoolYear: number;
  disableTransferAccess: boolean;
  schools: Organization[];
  organizations: UserOrganizations;
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
