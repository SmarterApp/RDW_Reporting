import { District, School } from "../shared/organization/organization";
import { CodedEntity } from "../shared/coded-entity";

/**
 * Client side representation of a report request.
 * This object must be mapped into a format that the server supports
 */
export interface AggregateReportFormSettings {

  /**
   * Assessment grades to be covered on the report
   */
  assessmentGrades: CodedEntity[];

  /**
   * Assessment type of the report
   */
  assessmentType: CodedEntity;

  /**
   * Completeness result filter
   */
  completenesses: CodedEntity[];

  /**
   * Economic disadvantage result filter
   */
  economicDisadvantages: CodedEntity[];

  /**
   * Race / Ethnicity result filter
   */
  ethnicities: CodedEntity[];

  /**
   * The comparative subgroups to compare on the report
   */
  dimensionTypes: string[];

  /**
   * Gender result filter
   */
  genders: CodedEntity[];

  /**
   * Individual education plans result filter
   */
  individualEducationPlans: CodedEntity[];

  /**
   * Interim administration condition result filter
   */
  interimAdministrationConditions: CodedEntity[];

  /**
   * English learners result filter
   */
  limitedEnglishProficiencies: CodedEntity[];

  /**
   * Migrant status result filter
   */
  migrantStatuses: CodedEntity[];

  /**
   * The achievement level graph display type
   */
  performanceLevelDisplayType: string;

  /**
   * Plan 504 result filter
   */
  section504s: CodedEntity[];

  /**
   * The school years to be covered on the report
   */
  schoolYears: number[];

  /**
   * Subject result filter
   */
  subjects: CodedEntity[];

  /**
   * Summative administration conditions result filter
   */
  summativeAdministrationConditions: CodedEntity[];

  /**
   * Determines if values are displayed as percent or number in the report
   */
  valueDisplayType: string;

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

}
