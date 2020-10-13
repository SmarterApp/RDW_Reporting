import { District, School } from '../shared/organization/organization';
import { ReportQueryType } from '../report/report';
import { AltScore, Claim, Subject } from './aggregate-report-options';
import { SubgroupFilters } from '../shared/model/subgroup-filters';

/**
 * Client side representation of a report request.
 * This object must be mapped into a format that the server supports
 */
export interface AggregateReportFormSettings {
  /**
   * Assessment type of the report
   */
  assessmentType: string;

  /**
   * Completeness result filter
   */
  completenesses: string[];

  /**
   * The comparative subgroups to compare on the report
   */
  dimensionTypes: string[];

  /**
   * Interim administration condition result filter
   */
  interimAdministrationConditions: string[];

  /**
   * The achievement level graph display type
   */
  performanceLevelDisplayType: string;

  /**
   * Whether or not to show empty results or not
   */
  showEmpty: boolean;

  /**
   * Subject result filter
   */
  subjects: Subject[];

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

  /**
   * The type of report
   */
  queryType: 'Basic' | 'FilteredSubgroup';

  /**
   * Defines the report type (standard or longitudinal)
   */
  reportType: ReportQueryType;

  /**
   * The advanced filters applied to basic reports
   */
  studentFilters: SubgroupFilters;

  /**
   * The custom subgroups applied to subgroup filter reports
   */
  subgroups: SubgroupFilters[];

  /**
   * Standard report assessment settings
   */
  generalPopulation: {
    /**
     * Assessment grades to be covered on the report
     */
    assessmentGrades: string[];

    /**
     * The school years to be covered on the report
     */
    schoolYears: number[];
  };

  /**
   * Claim report assessment settings
   */
  claimReport: {
    /**
     * Assessment grades to be covered on the report
     */
    assessmentGrades: string[];

    /**
     * The school years to be covered on the report
     */
    schoolYears: number[];

    /**
     * The claim codes
     */
    claimCodesBySubject: Claim[];
  };

  /**
   * AltScore report assessment settings
   */
  altScoreReport: {
    /**
     * Assessment grades to be covered on the report
     */
    assessmentGrades: string[];

    /**
     * The school years to be covered on the report
     */
    schoolYears: number[];

    /**
     * The alt score codes
     */
    altScoreCodesBySubject: AltScore[];
  };

  /**
   * Longitudinal report settings
   */
  longitudinalCohort: {
    /**
     * Assessment grades to be covered on the report
     */
    assessmentGrades: string[];

    /**
     * The school years to be covered on the report
     */
    toSchoolYear: number;
  };

  /**
   * Target report settings
   */
  targetReport: {
    /**
     * The school year for the report's assessment
     */
    schoolYear: number;

    /**
     * The subject code for the report's assessment
     */
    subjectCode: string;

    /**
     * The assessment grade for the report's assessment
     */
    assessmentGrade: string;
  };
}
