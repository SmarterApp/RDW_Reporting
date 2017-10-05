import { Organization } from "./organization";

/**
 * Represents the organizations the user is permitted to access exam results for
 */
export interface UserOrganizations {

  /**
   * All organizations entitled to the user
   */
  readonly organizations: Organization[];

  /**
   * All schools entitled to the user
   */
  readonly schools: Organization[];

  /**
   * All school groups entitled to the user
   */
  readonly schoolGroups: Organization[];

  /**
   * All school groups entitled to the user indexed by ID
   */
  readonly schoolGroupsById: Map<number, Organization>;

  /**
   * All districts entitled to the user
   */
  readonly districts: Organization[];

  /**
   * All districts entitled to the user indexed by ID
   */
  readonly districtsById: Map<number, Organization>;

}
