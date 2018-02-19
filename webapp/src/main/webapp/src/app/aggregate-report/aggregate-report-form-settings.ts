import { District, School } from "../shared/organization/organization";

/**
 * Client side representation of a report request.
 * This object must be mapped into a format that the server supports
 */
export interface AggregateReportFormSettings {

  /**
   * Assessment grades to be covered on the report
   */
  assessmentGrades: string[];

  /**
   * Assessment type of the report
   */
  assessmentType: string;

  /**
   * Completeness result filter
   */
  completenesses: string[];

  /**
   * Economic disadvantage result filter
   */
  economicDisadvantages: string[];

  /**
   * Race / Ethnicity result filter
   */
  ethnicities: string[];

  /**
   * The comparative subgroups to compare on the report
   */
  dimensionTypes: string[];

  /**
   * Gender result filter
   */
  genders: string[];

  /**
   * Individual education plans result filter
   */
  individualEducationPlans: string[];

  /**
   * Interim administration condition result filter
   */
  interimAdministrationConditions: string[];

  /**
   * English learners result filter
   */
  limitedEnglishProficiencies: string[];

  /**
   * Migrant status result filter
   */
  migrantStatuses: string[];

  /**
   * The achievement level graph display type
   */
  performanceLevelDisplayType: string;

  /**
   * Plan 504 result filter
   */
  section504s: string[];

  /**
   * The school years to be covered on the report
   */
  schoolYears: number[];

  /**
   * Subject result filter
   */
  subjects: string[];

  /**
   * Summative administration conditions result filter
   */
  summativeAdministrationConditions: string[];

  /**
   * Determines if values are displayed as percent or number in the report
   */
  valueDisplayType: string;

  /**
   * The user-selected result column order
   */
  columnOrder?: string[];

  /**
   * Determines if state results will be included in the report
   */
  includeStateResults: boolean;

  /**
   * Determines if all districts of the state should appear in the report
   */
  includeAllDistricts: boolean;

  /**
   * Determines if the schools of each selected district should appear in the report
   */
  includeAllSchoolsOfSelectedDistricts: boolean;

  /**
   * Determines if the district of each selected schools should appear in the report
   */
  includeAllDistrictsOfSelectedSchools: boolean;

  /**
   * The districts selected for the report
   */
  districts: District[];

  /**
   * The schools selected for the report
   */
  schools: School[];

  /**
   * The report name
   */
  name?: string;

}
