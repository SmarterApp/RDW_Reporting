import { OrganizationMapper } from "./organization/organization.mapper";
import { OrganizationGroupingService } from "./organization-grouping.service";
import { UserOrganizations } from "./organization/user-organizations";

describe('OrganizationGroupingService', () => {

  let mapper = new OrganizationMapper();
  let service: OrganizationGroupingService = new OrganizationGroupingService(mapper);
  let organizations: UserOrganizations;

  beforeEach(() => {
    organizations = mapper.createUserOrganizations([
      { id: 1, name: 'School 1', schoolGroupId: 1, districtId: 1 },
      { id: 2, name: 'School 2', schoolGroupId: 1, districtId: 1 },
      { id: 3, name: 'School 3', schoolGroupId: 2, districtId: 1 }
    ], [
      { id: 1, name: 'School Group 1', districtId: 1 },
      { id: 2, name: 'School Group 2', districtId: 1 }
    ], [
      { id: 1, name: 'District 1' }
    ]);
  });

  it('should return one school when one school of multi-school group/district', () => {
    expect(service.groupSelectedOrganizationIdsByType([
        organizations.schoolsById.get(1)
      ], organizations
    )).toEqual({
      districtIds: [],
      schoolGroupIds: [],
      schoolIds: [ 1 ]
    });
  });

  it('should return school group when all schools of group are selected', () => {
    expect(service.groupSelectedOrganizationIdsByType([
        organizations.schoolsById.get(1),
        organizations.schoolsById.get(2)
      ], organizations
    )).toEqual({
      districtIds: [],
      schoolGroupIds: [ 1 ],
      schoolIds: []
    });
  });

  it('should return district when all schools of the district are selected', () => {
    expect(service.groupSelectedOrganizationIdsByType([
        organizations.schoolsById.get(1),
        organizations.schoolsById.get(2),
        organizations.schoolsById.get(3),
      ], organizations
    )).toEqual({
      districtIds: [ 1 ],
      schoolGroupIds: [],
      schoolIds: []
    });
  });

  it('should handle multi-school export without district permissions', () => {
    organizations = new OrganizationMapper().createUserOrganizations([
      { id: 1, name: 'School 1', schoolGroupId: 1, districtId: 1 },
      { id: 2, name: 'School 2', schoolGroupId: 1, districtId: 2 },
    ], [
    ], [
    ]);

    expect(service.groupSelectedOrganizationIdsByType([
        organizations.schoolsById.get(1),
        organizations.schoolsById.get(2)
      ], organizations
    )).toEqual({
      districtIds: [],
      schoolGroupIds: [],
      schoolIds: [1, 2]
    });
  });

});
