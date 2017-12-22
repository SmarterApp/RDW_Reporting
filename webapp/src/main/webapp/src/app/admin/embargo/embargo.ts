/**
 * Holds information regarding the current embargo settings for a given organization
 */
import { OrganizationType } from "./organization-type.enum";

export interface Embargo {

  /**
   * The organization owning the embargo settings
   */
  organization: Organization;

  /**
   * The school year for which the embargo settings are applied
   */
  schoolYear: number;

  /**
   * True if the user can only read the setting and not change it
   */
  readonly: boolean;

  /**
   * Total Summative exam results by subject code
   */
  examCountsBySubject: { [key: string]: number };

  /**
   * True if individual Summative test results are embargoed
   */
  individualEnabled: boolean;

  /**
   * True if aggregate Summative test results are embargoed
   */
  aggregateEnabled: boolean;

}

/**
 * Holds organization information necessary to present embargo settings
 */
export interface Organization {

  /**
   * The organization entity ID
   */
  readonly id: number;

  /**
   * The organization name
   */
  readonly name: string;

  /**
   * The organization type
   */
  readonly type: OrganizationType;

}

