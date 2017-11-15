import { District, Organization, School, SchoolGroup } from "./organization";
import { Injectable } from "@angular/core";
import { Tree } from "./tree";
import { Option } from "@sbac/rdw-reporting-common-ngx";
import { UserOrganizations } from "./user-organizations";
import { isUndefined } from "util";
import { OrganizationType } from "./organization-type.enum";
import { createUuid } from "./organization-support";

@Injectable()
export class OrganizationMapper {

  private readonly nullDistrict: Organization = this.createDistrict();
  private readonly nullSchoolGroup: Organization = this.createSchoolGroup();

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
   * This method will add placeholder ancestor nodes to the school when then school group or createDistrict ID is undefined.
   *
   * @param {Organization[]} schools the schools to create the hierarchy with
   * @param {UserOrganizations} organizations master set of organizations to draw into the tree when referenced by the school's ancestor IDs
   * @returns {Tree<Organization>}
   */
  createOrganizationTreeWithPlaceholders(schools: Organization[], organizations: UserOrganizations): Tree<Organization> {
    let root = new Tree<Organization>();
    schools.forEach(school => root
        .getOrCreate(x => x.id === school.districtId, this.or(organizations.districtsById.get(school.districtId), this.nullDistrict))
        .getOrCreate(x => x.id === school.schoolGroupId, this.or(organizations.schoolGroupsById.get(school.schoolGroupId), this.nullSchoolGroup))
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
      if (!isUndefined(school.districtId)) {
        node = node.getOrCreate(x => x.id === school.districtId, organizations.districtsById.get(school.districtId))
      }
      if (!isUndefined(school.schoolGroupId)) {
        node = node.getOrCreate(x => x.id === school.schoolGroupId, organizations.schoolGroupsById.get(school.schoolGroupId))
      }
      node.create(school);
    });
    return root;
  }

  private or(a: any, b: any) {
    return isUndefined(a) ? b : a;
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
