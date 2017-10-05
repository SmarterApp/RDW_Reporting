import { OrganizationType } from "./organization-type.enum";
import { createUuid } from "./organization-support";

/**
 * Represents an organization in the organizational hierarchy
 */
export interface Organization {

  /**
   * Fully qualified organization ID
   */
  readonly uuid: string;

  /**
   * The organization type (school, district, ...etc)
   */
  readonly type: OrganizationType;

  /**
   * The organization ID
   */
  readonly id: number;

  /**
   * The organization name
   */
  readonly name: string;

  /**
   * The organization school ID
   * This will only be present on schools and is used by the isOrIsAncestorOf() method
   */
  readonly schoolId?: number;

  /**
   * The organization's school group ID
   * This will be present on schools and school groups and is used by the isOrIsAncestorOf() method
   */
  readonly schoolGroupId?: number;

  /**
   * The organization's district ID
   * This will be present on schools, school groups and districts and is used by the isOrIsAncestorOf() method
   */
  readonly districtId?: number;

  /**
   * Determines if the organization has the same ID or is an ancestor of the given argument.
   *
   * @param x the organization to test
   * @returns <code>true</code> if the organization's ID is the same or it is an ancestor of the given organization
   */
  isOrIsAncestorOf(x: Organization): boolean;

}

abstract class AbstractOrganization implements Organization {

  id: number;
  name: string;

  get uuid(): string {
    return createUuid(this.type, this.id);
  }

  abstract get type(): OrganizationType;

  abstract isOrIsAncestorOf(x: Organization): boolean;

}

export class School extends AbstractOrganization implements Organization {

  schoolGroupId: number;
  districtId: number;

  get schoolId(): number {
    return this.id;
  }

  get type(): OrganizationType {
    return OrganizationType.School;
  }

  isOrIsAncestorOf(x: Organization): boolean {
    return this.id === x.schoolId;
  };

}

export class SchoolGroup extends AbstractOrganization implements Organization {

  districtId: number;

  get schoolGroupId(): number {
    return this.id;
  }

  get type(): OrganizationType {
    return OrganizationType.SchoolGroup;
  }

  isOrIsAncestorOf(x: Organization): boolean {
    return this.id === x.schoolGroupId;
  };

}

export class District extends AbstractOrganization implements Organization {

  get districtId(): number {
    return this.id;
  }

  get type(): OrganizationType {
    return OrganizationType.District;
  }

  isOrIsAncestorOf(x: Organization): boolean {
    return this.id === x.districtId;
  };

}
