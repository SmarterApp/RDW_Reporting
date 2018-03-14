import { District, Organization, School, SchoolGroup } from "./organization";
import { Injectable } from "@angular/core";
import { Tree } from "./tree";
import { UserOrganizations } from "./user-organizations";
import { OrganizationType } from "./organization-type.enum";
import { createUuid } from "./organization-support";
import { Option } from "../../shared/form/sb-typeahead.component";
import { Utils } from "../../shared/support/support";

@Injectable()
export class OrganizationMapper {

  createDistrict(value: any = {}): District {
    let district = new District();
    district.id = value.id;
    district.name = value.name;
    return district;
  }

  createSchoolGroup(value: any = {}): SchoolGroup {
    let schoolGroup = new SchoolGroup();
    schoolGroup.id = value.id;
    schoolGroup.name = value.name;
    schoolGroup.districtId = value.districtId;
    return schoolGroup;
  }

  createSchool(value: any = {}): School {
    let school = new School();
    school.id = value.id;
    school.name = value.name;
    school.schoolGroupId = value.schoolGroupId;
    school.districtId = value.districtId;
    return school;
  }

  /**
   * Creates local UserOrganizations model from the provided remote school, school group and district API models
   *
   * @param {any[]} remoteSchools
   * @param {any[]} remoteSchoolGroups
   * @param {any[]} remoteDistricts
   * @returns {UserOrganizations}
   */
  createUserOrganizations(remoteSchools: any[], remoteSchoolGroups: any[], remoteDistricts: any[]): UserOrganizations {
    let schools = remoteSchools.map(x => this.createSchool(x)),
      schoolGroups = remoteSchoolGroups.map(x => this.createSchoolGroup(x)),
      districts = remoteDistricts.map(x => this.createDistrict(x));

    return {
      organizations: [ ...districts, ...schoolGroups, ...schools ],
      schools: schools,
      schoolsById: this.index(schools, x => x.id),
      schoolGroups: schoolGroups,
      schoolGroupsById: this.index(schoolGroups, x => x.id),
      districts: districts,
      districtsById: this.index(districts, x => x.id)
    };
  }

  private index<K, V>(array: V[], indexer: (value: V) => K ): Map<K, V> {
    return new Map<K, V>(array.map(x => <any>[ indexer(x), x ]))
  }

  /**
   * Creates organization options for selection.
   *
   * @param {Organization[]} schools
   * @param {Map<string, Option>} optionsByUuid
   * @returns {Option[]}
   */
  createOptions(schools: Organization[], optionsByUuid: Map<string, Option>): Option[] {
    let options = [],
      districts = new Grouping<string, Option>(options),
      schoolGroups = new Grouping<string, Option>(options);

    schools.forEach(school => {
      let districtUuid = createUuid(OrganizationType.District, school.districtId),
        schoolGroupUuid = createUuid(OrganizationType.SchoolGroup, school.schoolGroupId),
        schoolUuid = school.uuid;

      school.districtId && districts.computeIfAbsent(districtUuid, () => optionsByUuid.get(districtUuid));
      school.schoolGroupId && schoolGroups.computeIfAbsent(schoolGroupUuid, () => optionsByUuid.get(schoolGroupUuid));
      options.push(optionsByUuid.get(schoolUuid));
    });
    return options;
  }

  /**
   * Creates organization hierarchy for the given schools and master set of organizations.
   * This method will add placeholder ancestor nodes to the school when then school group or district ID is undefined.
   *
   * @param {Organization[]} schools the schools to create the hierarchy with
   * @param {UserOrganizations} organizations master set of organizations to draw into the tree when referenced by the school's ancestor IDs
   * @returns {Tree<Organization>}
   */
  createOrganizationTreeWithPlaceholders(schools: Organization[], organizations: UserOrganizations): Tree<Organization> {
    const root = new Tree<Organization>();
    schools.forEach(school => root
        .getOrCreate(x => x.id === school.districtId, this.getOrCreateDistrict(organizations, school.districtId))
        .getOrCreate(x => x.id === school.schoolGroupId, this.getOrCreateSchoolGroup(organizations, school.schoolGroupId))
        .create(school)
    );
    return root;
  }

  /**
   * Creates organization hierarchy with the given organizations.
   *
   * @param {UserOrganizations} organizations master set of organizations to create the tree from
   * @returns {Tree<Organization>} organization hierarchy
   */
  createOrganizationTree(organizations: UserOrganizations): Tree<Organization> {
    let root = new Tree<Organization>();
    organizations.schools.forEach(school => {
      let node = root;
      if (!Utils.isUndefined(school.districtId)) {
        node = node.getOrCreate(
          x => x.id === school.districtId,
          this.getOrCreateDistrict(organizations, school.districtId));
      }
      if (!Utils.isUndefined(school.schoolGroupId)) {
        node = node.getOrCreate(
          x => x.id === school.schoolGroupId,
          this.getOrCreateSchoolGroup(organizations, school.schoolGroupId))
      }
      node.create(school);
    });
    return root;
  }

  private getOrCreateDistrict(organizations: UserOrganizations, id: number): District {
    if (organizations.districtsById.has(id)) {
      return organizations.districtsById.get(id);
    }

    const district: District = new District();
    if (!Utils.isNullOrUndefined(id)) {
      district.id = id;
    }
    return district;
  }

  private getOrCreateSchoolGroup(organizations: UserOrganizations, id: number): SchoolGroup {
    if (organizations.schoolGroupsById.has(id)) {
      return organizations.schoolGroupsById.get(id);
    }

    const schoolGroup: SchoolGroup = new SchoolGroup();
    if (!Utils.isNullOrUndefined(id)) {
      schoolGroup.id = id;
    }
    return schoolGroup;
  }

}

/**
 * Helper which prevents redundancy from occurring in the expanded set of organizations
 */
class Grouping<A, B> {

  private keys: Set<A> = new Set();

  constructor(private values: B[]) {
  }

  /**
   * Appends the result of the provided factory method to the given array if the key is not present
   *
   * @param {A} key the ID used to check for presence
   * @param {() => B} factory the result of this method will be added to the array
   */
  computeIfAbsent(key: A, factory: () => B): void {
    if (!this.keys.has(key)) {
      this.keys.add(key);
      this.values.push(factory());
    }
  }

}
