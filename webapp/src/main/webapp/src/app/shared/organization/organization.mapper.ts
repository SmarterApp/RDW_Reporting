import { Injectable } from "@angular/core";
import {
  DefaultDistrict, DefaultDistrictGroup, DefaultSchool, DefaultSchoolGroup, DefaultState,
  Organization
} from "./organization";

@Injectable()
export class OrganizationMapper {

  public map(organization: any): Organization {

    // TODO fix models to avoid this bridge
    const type = organization.type || organization.organizationType;

    switch (type) {
      case 'School':
        const school: DefaultSchool = new DefaultSchool();
        school.name = organization.name;
        school.id = organization.id;
        school.districtGroupId = organization.districtGroupId;
        school.districtId = organization.districtId;
        school.schoolGroupId = organization.schoolGroupId;
        return school;
      case 'SchoolGroup':
        const schoolGroup: DefaultSchoolGroup = new DefaultSchoolGroup();
        schoolGroup.name = organization.name;
        schoolGroup.id = organization.id;
        schoolGroup.districtGroupId = organization.districtGroupId;
        schoolGroup.districtId = organization.districtId;
        return schoolGroup;
      case 'District':
        const district: DefaultDistrict = new DefaultDistrict();
        district.name = organization.name;
        district.id = organization.id;
        district.districtGroupId = organization.districtGroupId;
        return district;
      case 'DistrictGroup':
        const districtGroup: DefaultDistrictGroup = new DefaultDistrictGroup();
        districtGroup.name = organization.name;
        districtGroup.id = organization.id;
        return districtGroup;
      case 'State':
        const state: DefaultState = new DefaultState();
        state.name = organization.name;
        return state;
      default:
        throw new Error('invalid organization type: ' + type);
    }
  }

}
