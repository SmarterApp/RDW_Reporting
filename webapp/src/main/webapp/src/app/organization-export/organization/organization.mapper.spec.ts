import { OrganizationMapper } from "./organization.mapper";
import { Option } from "@sbac/rdw-reporting-common-ngx";
import { Organization } from "./organization";
import { Tree } from "./tree";

describe('OrganizationService', () => {

  let fixture: OrganizationMapper = new OrganizationMapper();

  it('createUserOrganizations() should create user organizations from provided organizations', () => {

    let schools = [ { id: 1, name: 'School A', districtId: 2 } ].map(x => fixture.createSchool(x)),
      schoolGroups = [],
      districts: Organization[] = [ { id: 2, name: 'District A' } ].map(x => fixture.createDistrict(x));

    let expected = {
      organizations: [ ...districts, ...schools ],
      schools: schools,
      schoolsById: new Map([ [ 1, schools[ 0 ] ] ]),
      schoolGroups: schoolGroups,
      schoolGroupsById: new Map(),
      districts: districts,
      districtsById: new Map([ [ 2, districts[ 0 ] ] ])
    };

    let actual = fixture.createUserOrganizations(schools, schoolGroups, districts);

    expect(actual).toEqual(expected);
  });

  it('createUserOrganizations() should not accept null args', () => {
    expect(() => fixture.createUserOrganizations(null, null, null)).toThrowError();
  });

  it('create<Organization>() should create non-colliding uuid for organizations with the same ID', () => {

    let id = 1;
    let uuids = [
      fixture.createSchool({ id: id }),
      fixture.createSchoolGroup({ id: id }),
      fixture.createDistrict({ id: id })
    ].map(x => x.uuid);

    expect(new Set(uuids).size).toBe(uuids.length);
  });

  it('isOrIsAncestorOf() should be true when schools are the same', () => {

    let schoolA = fixture.createSchool({ id: 1 });
    let schoolB = fixture.createSchool({ id: 2 });

    expect(schoolA.isOrIsAncestorOf(schoolA)).toBe(true);
    expect(schoolA.isOrIsAncestorOf(schoolB)).toBe(false);
  });

  it('isOrIsAncestorOf() should be true when school groups are the same or when they contain the organization', () => {

    let schoolGroupA = fixture.createSchool({ id: 1 });
    let schoolGroupB = fixture.createSchool({ id: 2 });
    let schoolA = fixture.createSchool({ id: 1, schoolGroupId: 1 });
    let schoolB = fixture.createSchool({ id: 2, schoolGroupId: 2 });

    expect(schoolGroupA.isOrIsAncestorOf(schoolGroupA)).toBe(true);
    expect(schoolGroupA.isOrIsAncestorOf(schoolGroupB)).toBe(false);
    expect(schoolGroupA.isOrIsAncestorOf(schoolA)).toBe(true);
    expect(schoolGroupA.isOrIsAncestorOf(schoolB)).toBe(false);
  });

  it('isOrIsAncestorOf() should be true when districts are the same or when they contain the organization', () => {

    let districtA = fixture.createSchool({ id: 1 });
    let districtB = fixture.createSchool({ id: 2 });
    let schoolA = fixture.createSchool({ id: 1, districtId: 1 });
    let schoolB = fixture.createSchool({ id: 2, districtId: 2 });

    expect(districtA.isOrIsAncestorOf(districtA)).toBe(true);
    expect(districtA.isOrIsAncestorOf(districtB)).toBe(false);
    expect(districtA.isOrIsAncestorOf(schoolA)).toBe(true);
    expect(districtA.isOrIsAncestorOf(schoolB)).toBe(false);
  });

  it('createOptions() should infer and expand schools into their containing groups and districts if present', () => {

    let organizations = fixture.createUserOrganizations([ { id: 1, districtId: 2 } ], [], [ { id: 2 } ]);

    let toOption = (org: Organization) => <any>{ value: org, group: '', label: org.name };

    let optionsByUuid = new Map<string, Option>(organizations.organizations.map(x => <any>[ x.uuid, toOption(x) ]));

    let options = fixture.createOptions(organizations.schools, optionsByUuid);

    expect(options).toEqual([
      toOption(organizations.districts[ 0 ]),
      toOption(organizations.schools[ 0 ])
    ]);

  });

  it('createOrganizationTree() create a tree representative of the given organizations', () => {

    let organizations = fixture
      .createUserOrganizations([ { id: 1, districtId: 2 } ], [], [ { id: 2 } ]);

    let actual = fixture.createOrganizationTree(organizations);

    let expected = new Tree();
    expected
      .create(organizations.districts[ 0 ])
      .create(organizations.schools[ 0 ]);

    expect(actual).toEqual(expected);
  });

  it('createOrganizationTreeWithPlaceholders() should create a tree representative of the given organizations with placeholders when ancestors are absent', () => {

    let organizations = fixture
      .createUserOrganizations([ { id: 1, districtId: 2 }, { id: 3 } ], [], [ { id: 2 } ]);

    let actual = fixture.createOrganizationTreeWithPlaceholders([ organizations.schools[ 0 ] ], organizations);

    let expected = new Tree();
    expected
      .create(organizations.districts[ 0 ])
      .create(fixture.createSchoolGroup())
      .create(organizations.schools[ 0 ]);

    expect(actual).toEqual(expected);
  });

});
