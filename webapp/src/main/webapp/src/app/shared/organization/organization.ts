export interface Organization {
  readonly name: string;
  readonly type: OrganizationType;
  equals(other: Organization): boolean;
}

interface IdentifiableOrganization extends Organization {
  readonly id: number;
  readonly naturalId?: string;
}

abstract class AbstractOrganization {
  name: string;
  abstract get type();
  equals(other: Organization): boolean {
    return this.type === other.type;
  }
}

abstract class AbstractIdentifiableOrganization extends AbstractOrganization {
  id: number;
  naturalId: string;
  equals(other: Organization): boolean {
    return this.type === other.type
      && this.id === (<IdentifiableOrganization>other).id;
  }
}

export enum OrganizationType {
  State = 'State',
  DistrictGroup = 'DistrictGroup',
  District = 'District',
  SchoolGroup = 'SchoolGroup',
  School = 'School'
}

export interface State extends Organization {
}

export interface DistrictGroup extends IdentifiableOrganization {
}

export interface District extends IdentifiableOrganization {
  readonly districtGroupId?: number;
}

export interface SchoolGroup extends IdentifiableOrganization {
  readonly districtId?: number;
  readonly districtGroupId?: number;
}

export interface School extends IdentifiableOrganization {
  readonly districtName?: string;
  readonly schoolGroupId?: number;
  readonly districtId?: number;
  readonly districtGroupId?: number;
}

export class DefaultState extends AbstractOrganization implements State {
  get type(): OrganizationType {
    return OrganizationType.State;
  }
}

export class DefaultDistrictGroup extends AbstractIdentifiableOrganization implements DistrictGroup {
  get type(): OrganizationType {
    return OrganizationType.DistrictGroup;
  }
}

export class DefaultDistrict extends AbstractIdentifiableOrganization implements District {
  districtGroupId: number;
  get type(): OrganizationType {
    return OrganizationType.District;
  }
}

export class DefaultSchoolGroup extends AbstractIdentifiableOrganization implements SchoolGroup {
  districtId: number;
  districtGroupId: number;
  get type(): OrganizationType {
    return OrganizationType.SchoolGroup;
  }
}

export class DefaultSchool extends AbstractIdentifiableOrganization implements School {
  schoolGroupId: number;
  districtId: number;
  districtGroupId: number;
  districtName: string;
  get type(): OrganizationType {
    return OrganizationType.School;
  }
}

export class SchoolsWrapper {
  hasMoreSchools: boolean;
  schools: School[] = [];
}
