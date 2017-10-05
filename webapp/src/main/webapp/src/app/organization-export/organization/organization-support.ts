import { OrganizationType } from "./organization-type.enum";

/**
 * Creates a UUID by compounding the organization type and ID
 *
 * @param {OrganizationType} type the organization type
 * @param {number} id the organization entity ID
 * @returns {string} the UUID
 */
export const createUuid = (type: OrganizationType, id: number): string => {
  return `${type}-${id}`;
};
