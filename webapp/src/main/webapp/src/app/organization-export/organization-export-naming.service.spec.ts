import { OrganizationMapper } from "./organization/organization.mapper";
import { OrganizationExportNamingService } from "./organization-export-naming.service";

describe('OrganizationExportNamingService', () => {

  let service: OrganizationExportNamingService = new OrganizationExportNamingService();
  let organizations = new OrganizationMapper().createUserOrganizations([
    { id: 1, name: 'School 1', schoolGroupId: 1, districtId: 1 },
    { id: 2, name: 'School 2', schoolGroupId: 1, districtId: 1 },
    { id: 3, name: 'School 3', schoolGroupId: 2, districtId: 1 },
    { id: 4, name: 'School 4', districtId: 2 },
    { id: 5, name: 'School 5', districtId: 2 }
  ], [
    { id: 1, name: 'School Group 1', districtId: 1 },
    { id: 2, name: 'School Group 2', districtId: 1 },
    { id: 3, name: 'School Group 3', districtId: 2 }
  ], [
    { id: 1, name: 'District 1' },
    { id: 2, name: 'District 2' }
  ]);

  it('should return school year as name when there is no selection', () => {
    let options = {
      schoolYear: 1000,
      schoolIds: [],
      schoolGroupIds: [],
      districtIds: []
    };
    expect(service.name(options, organizations)).toBe('1000');
  });

  it('should return school name when one school', () => {
    let options = {
      schoolYear: 1000,
      schoolIds: [ 1 ],
      schoolGroupIds: [],
      districtIds: []
    };
    expect(service.name(options, organizations)).toBe('School 1 1000');
  });

  it('should return school group name when two schools of same group', () => {
    let options = {
      schoolYear: 1000,
      schoolIds: [ 1, 2 ],
      schoolGroupIds: [],
      districtIds: []
    };
    expect(service.name(options, organizations)).toBe('School Group 1 1000');
  });

  it('should return district name when two schools of different group', () => {
    let options = {
      schoolYear: 1000,
      schoolIds: [ 1, 3 ],
      schoolGroupIds: [],
      districtIds: []
    };
    expect(service.name(options, organizations)).toBe('District 1 1000');
  });

  it('should return school group name when one school group', () => {
    let options = {
      schoolYear: 1000,
      schoolIds: [],
      schoolGroupIds: [ 1 ],
      districtIds: []
    };
    expect(service.name(options, organizations)).toBe('School Group 1 1000');
  });

  it('should return district name when multiple school groups', () => {
    let options = {
      schoolYear: 1000,
      schoolIds: [],
      schoolGroupIds: [ 1, 2 ],
      districtIds: []
    };
    expect(service.name(options, organizations)).toBe('District 1 1000');
  });

  it('should return district name when school group and schools are selected', () => {
    let options = {
      schoolYear: 1000,
      schoolIds: [ 1 ],
      schoolGroupIds: [ 2 ],
      districtIds: []
    };
    expect(service.name(options, organizations)).toBe('District 1 1000');
  });

  it('should return district name when one district', () => {
    let options = {
      schoolYear: 1000,
      schoolIds: [],
      schoolGroupIds: [],
      districtIds: [ 1 ]
    };
    expect(service.name(options, organizations)).toBe('District 1 1000');
  });

  it('should handle multi-school export without district permissions', () => {
    organizations = new OrganizationMapper().createUserOrganizations([
      { id: 1, name: 'School 1', schoolGroupId: 1, districtId: 1 },
      { id: 2, name: 'School 2', schoolGroupId: 1, districtId: 2 },
    ], [
    ], [
    ]);

    let options = {
      schoolYear: 1000,
      schoolIds: [1, 2],
      schoolGroupIds: [],
      districtIds: []
    };
    expect(service.name(options, organizations)).toBe('School 1 1000');
  });

});


