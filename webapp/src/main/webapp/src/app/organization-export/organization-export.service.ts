import { Observable } from "rxjs/Observable";
import { DataService } from "../shared/data/data.service";
import { Injectable } from "@angular/core";
import { ResponseUtils } from "../shared/response-utils";
import { Organization } from "./organization/organization";
import { UserOrganizations } from "./organization/user-organizations";
import { OrganizationMapper } from "./organization/organization.mapper";
import { Tree } from "./organization/tree";
import { OrganizationType } from "./organization/organization-type.enum";

@Injectable()
export class OrganizationExportService {

  constructor(private dataService: DataService,
              private mapper: OrganizationMapper){
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
    return this.createExportInternal(this.createExportRequest(schoolYear, schools, organizations));
  }

  private createExportInternal(request: OrganizationExportRequest): Observable<void> {
    return this.dataService.post('/organizations/examExport', request)
      .catch(ResponseUtils.throwError);
  }

  private createExportRequest(schoolYear: number, schools: Organization[], organizations: UserOrganizations): OrganizationExportRequest {
    return Object.assign(
      { schoolYear: schoolYear },
      this.groupSelectedOrganizationIdsByType(schools, organizations)
    );
  }

  /**
   * Groups selected organization IDs by type into a grouped organization ID holder.
   * This is to shrink the payload size to the server by reducing all schools of a group to just a school group ID
   * and further to a district ID when all schools of the group of district are selected.
   *
   * @param {Organization[]} schools the selected schools
   * @param {UserOrganizations} organizations all user organizations
   * @returns {GroupedOrganizationIds} the grouped selected organization IDs
   */
  private groupSelectedOrganizationIdsByType(schools: Organization[], organizations: UserOrganizations): GroupedOrganizationIds {

    // creates export request with organization type buckets for use in later processing
    let ids = {
      districtIds: [],
      schoolGroupIds: [],
      schoolIds: []
    };

    // all school IDs selected by the user
    let selectedSchoolIds = new Set<number>(schools.map(school => school.id));

    // organizational hierarchy of all organizations entitled to the user
    let organizationTree = this.mapper.createOrganizationTree(organizations);

    // starts the recursive grouping of organizations by type
    organizationTree.children.forEach(child => this.groupIfAllDescendantsSelected(child, selectedSchoolIds, ids));

    return ids;
  }

  /**
   * Adds the given organization's ID to the appropriate ID collection in the given grouped organization ID holder.
   *
   * @param {Organization} organization the organization to add
   * @param {GroupedOrganizationIds} groupedOrganizationIds the ID collection holder to add the organization ID to
   */
  private groupOrganization(organization: Organization, ids: GroupedOrganizationIds) {
    switch (organization.type) {
      case OrganizationType.District:
        ids.districtIds.push(organization.id);
        break;
      case OrganizationType.SchoolGroup:
        ids.schoolGroupIds.push(organization.id);
        break;
      case OrganizationType.School:
        ids.schoolIds.push(organization.id);
        break;
    }
  }

  /**
   * Recursively checks if all descendants of the given tree node are selected using the given selected school ID collection
   *
   * @param {Tree<Organization>} node the node to check
   * @param {Set<number>} selectedSchoolIds the selected school IDs
   * @returns {boolean} <code>true</code> if all descendants of the given node are selected
   */
  private allDescendantsSelected(node: Tree<Organization>, selectedSchoolIds: Set<number>): boolean {
    if (node.value.type === OrganizationType.School) {
      return selectedSchoolIds.has(node.value.id);
    }
    return node.children.every(child => this.allDescendantsSelected(child, selectedSchoolIds));
  };

  /**
   * Recursively adds organization ID to grouped organization IDs if all of its descendants are selected.
   * If all of the node's descendants are selected it does not continue recursively checking descendants.
   *
   * @param {Tree<Organization>} node the tree node to check descendant selection for
   * @param {Set<number>} selectedSchoolIds master set of all selected school IDs
   * @param {GroupedOrganizationIds} ids grouped organization IDs
   */
  private groupIfAllDescendantsSelected(node: Tree<Organization>, selectedSchoolIds: Set<number>, ids: GroupedOrganizationIds) {
    if (this.allDescendantsSelected(node, selectedSchoolIds)) {
      this.groupOrganization(node.value, ids);
    } else {
      node.children.forEach(child => this.groupIfAllDescendantsSelected(child, selectedSchoolIds, ids));
    }
  }

}


/**
 * Represents custom export request and holds different exam result filter options
 */
interface OrganizationExportRequest extends GroupedOrganizationIds {

  /**
   * School year to filter on
   */
  readonly schoolYear: number;

}

/**
 * Organization IDs grouped by type
 */
interface GroupedOrganizationIds {

  /**
   * District IDs to filter on
   */
  readonly districtIds?: number[];

  /**
   * School group IDs to filter on
   */
  readonly schoolGroupIds?: number[];

  /**
   * School IDs to filter on
   */
  readonly schoolIds?: number[];

}
