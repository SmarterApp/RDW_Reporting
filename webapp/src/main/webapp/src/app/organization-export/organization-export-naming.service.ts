import { UserOrganizations } from "./organization/user-organizations";
import { GroupedOrganizationIds, OrganizationExportOptions } from "./organization-export-options";
import { Utils } from "../shared/support/support";

export class OrganizationExportNamingService {

  /**
   * Generates a name for an export request for the given parameters.
   * This method does not support naming exports with organizations from multiple districts.
   *
   * @param {OrganizationExportOptions} schoolYear the export request schoolYear
   * @param {OrganizationExportOptions} options the export request options
   * @param {UserOrganizations} organizations all user organizations
   * @returns {string} the default export name
   */
  name(options: OrganizationExportOptions, organizations: UserOrganizations): string {
    let basename = this.getSelectedOrganizationOrFirstCommonAncestorName(options, organizations);
    return `${basename} ${options.schoolYear}`.trim();
  }

  /**
   * If the user has selected one organization this method will return that organization's name.
   * If the user has multiple selections it will return the name of their first common ancestor organization.
   * This method assumes that each school has a district and that only up to one district may be selected.
   *
   * @param {GroupedOrganizationIds} ids
   * @param {UserOrganizations} organizations
   * @returns {string}
   */
  private getSelectedOrganizationOrFirstCommonAncestorName(ids: GroupedOrganizationIds, organizations: UserOrganizations): string {
    let selection = this.getSelectionWithAncestry(ids, organizations);

    // process district selection
    if (selection.districtCount == 1) {
      return selection.firstDistrict.name;
    }

    // process school group selection
    if (selection.schoolGroupCount == 1) {
      if (selection.schoolCount == 0) {
        return selection.firstSchoolGroup.name;
      }
      return selection.firstSchoolGroup.district.name;
    }
    if (selection.schoolGroupCount > 1) {
      return selection.firstSchoolGroup.district.name;
    }

    // process school selection
    if (selection.schoolCount == 1) {
      return selection.firstSchool.name;
    }
    if (selection.schoolCount > 1) {
      if (!Utils.isUndefined(selection.firstSchool.schoolGroupId)
        && !Utils.isUndefined(selection.firstSchool.schoolGroup)
        && selection.schools.every(x => x.schoolGroupId === selection.firstSchool.schoolGroupId)) {
        return selection.firstSchool.schoolGroup.name;
      }
      if (!Utils.isUndefined(selection.firstSchool.district)) {
        return selection.firstSchool.district.name;
      }
      return selection.firstSchool.name;
    }
    return '';
  }

  /**
   * Support method for getSelectedOrganizationOrFirstCommonAncestorName()
   * This method maps each organization ID to an organization object with district and schoolGroup properties to help
   * navigate the organization ancestry chain.
   *
   * @param {GroupedOrganizationIds} request
   * @param {UserOrganizations} organizations
   * @returns {any}
   */
  private getSelectionWithAncestry(request: GroupedOrganizationIds, organizations: UserOrganizations) {
    let districts = request.districtIds.map(id => {
        let district = organizations.districtsById.get( id );
        return Object.assign({}, district);
      }),
      schoolGroups = request.schoolGroupIds.map(id => {
        let schoolGroup = organizations.schoolGroupsById.get( id );
        let district = organizations.districtsById.get( schoolGroup.districtId );
        return Object.assign({ district: district }, schoolGroup);
      }),
      schools = request.schoolIds.map(id => {
        let school = organizations.schoolsById.get( id );
        let schoolGroup = organizations.schoolGroupsById.get( school.schoolGroupId );
        let district = organizations.districtsById.get( school.districtId );
        return Object.assign({ district: district, schoolGroup: schoolGroup }, school);
      });

    return {
      districts: districts,
      districtCount: districts.length,
      firstDistrict: districts[ 0 ],
      schoolGroups: schoolGroups,
      schoolGroupCount: schoolGroups.length,
      firstSchoolGroup: schoolGroups[ 0 ],
      schools: schools,
      schoolCount: schools.length,
      firstSchool: schools[ 0 ]
    }
  }

}
