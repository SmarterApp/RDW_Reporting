import { Organization } from "./organization/organization";
import { UserOrganizations } from "./organization/user-organizations";
import { GroupedOrganizationIds } from "./organization-export-options";
import { Injectable } from "@angular/core";
import { OrganizationMapper } from "./organization/organization.mapper";
import { OrganizationType } from "./organization/organization-type.enum";
import { Tree } from "./organization/tree";
import { Utils } from "../shared/support/support";

@Injectable()
export class OrganizationGroupingService {

  constructor(private mapper: OrganizationMapper){
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
  groupSelectedOrganizationIdsByType(schools: Organization[], organizations: UserOrganizations): GroupedOrganizationIds {

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
    if (this.validGroupingNode(node) && this.allDescendantsSelected(node, selectedSchoolIds)) {
      this.groupOrganization(node.value, ids);
    } else {
      node.children.forEach(child => this.groupIfAllDescendantsSelected(child, selectedSchoolIds, ids));
    }
  }

  /**
   * Test if this is a valid grouping node.  While building the organization tree we create shallow
   * placeholders for districts and school groups that the user does not have explicit access to.  These
   * shallow nodes should not be used for grouping.
   *
   * @param {Tree<Organization>} node An organizaiton node
   * @returns {boolean} True if the node is a valid grouping node
   */
  private validGroupingNode(node: Tree<Organization>) {
    return !Utils.isNullOrUndefined(node.value.name);
  }

}
