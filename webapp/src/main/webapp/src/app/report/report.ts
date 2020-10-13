/**
 * Represents a user's report
 */
export interface UserReport<T extends ReportQuery = ReportQuery> {
  id: number;
  query: T;
  status: ReportStatus;
  created: Date;
  metadata?: { [key: string]: string };
}

/**
 * Represents a user's saved query
 */
export interface UserQuery<T extends ReportQuery = ReportQuery> {
  id?: number;
  query: T;
  updated?: Date;
  created?: Date;
}

/**
 * Declares all valid report statuses
 */
export type ReportStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'NO_RESULTS'
  | 'FAILED';

/**
 * Declares all valid report types
 */
export type ReportQueryType =
  | 'Student'
  | 'Group'
  | 'SchoolGrade'
  | 'DistrictSchoolExport'
  | 'CustomAggregate'
  | 'Longitudinal'
  | 'Claim'
  | 'AltScore'
  | 'Target';

/**
 * Base set of advanced filters found on single-student printable reports
 */
export interface SingleStudentPrintableReportFilters {
  offGradeAssessments: boolean;
  completenessCodes: string[];
  administrativeConditionCodes: string[];
}

/**
 * Base set of advanced filters found on multi-student printable reports
 */
interface BaseStudentFilters {
  ethnicityCodes?: string[];
  genderCodes?: string[];
  individualEducationPlanCodes?: string[];
  limitedEnglishProficiencyCodes?: string[];
  englishLanguageAcquisitionStatusCodes?: string[];
  migrantStatusCodes?: string[];
  section504Codes?: string[];
  languageCodes?: string[];
  militaryConnectedCodes?: string[];
}

/**
 * Represents advanced filters found on multi-student printable reports
 */
export interface MultiStudentPrintableReportFilters
  extends SingleStudentPrintableReportFilters,
    BaseStudentFilters {}

/**
 * Represents advanced filters found on aggregate reports
 */
export interface AggregateReportStudentFilters extends BaseStudentFilters {
  economicDisadvantageCodes?: string[];
}

/**
 * Base class for all report queries
 */
export interface ReportQuery {
  /**
   * The requested report name
   */
  name: string;

  /**
   * The report type
   */
  type: ReportQueryType;
}

/**
 * Base for all exam centric reports (This includes printable reports and district/school exports)
 */
export interface ExamReportQuery extends ReportQuery {
  /**
   * The school year to filter results on
   */
  schoolYear: number;

  /**
   * If true, students with transfer results will not be included in the report
   */
  disableTransferAccess?: boolean;
}

/**
 * Base for all printable reports
 */
export interface PrintableReportQuery extends ExamReportQuery {
  /**
   * An undefined subject code indicates to search on "all subjects"
   * Or in other words, to "apply no subject search filter"
   */
  subjectCode?: string;

  /**
   * An undefined assessment type indicates to search on "all assessment types"
   * Or in other words, to "apply no assessment type search filter"
   */
  assessmentTypeCode?: string;

  /**
   * The language code used to indicate which language to create the report in
   */
  language: string;

  /**
   * If true, accommodation information will appear in the report
   */
  accommodationsVisible?: boolean;
}

/**
 * Base for all multi-student printable reports
 */
export interface BatchPrintableReportQuery extends PrintableReportQuery {
  /**
   * The order by which to sort the student reports
   */
  order: PrintableReportOrder;
}

/**
 * Declares all valid multi-student printable report student report orderings
 */
export type PrintableReportOrder = 'StudentName' | 'StudentSSID';

/**
 * Defines the parameters of a single student printable report
 */
export interface StudentPrintableReportQuery extends PrintableReportQuery {
  studentId: number;
}

/**
 * Declares all valid group types
 *
 * TODO move this to a dedicated file
 */
export type UserGroupType = 'Admin' | 'Teacher';

/**
 * Represents a group identifier.
 *
 * TODO move this to a dedicated file
 */
export interface UserGroupId {
  id: number;
  type: UserGroupType;
}

/**
 * Represents a group-based multi-student printable report query
 */
export interface GroupPrintableReportQuery extends BatchPrintableReportQuery {
  groupId: UserGroupId;
}

/**
 * Represents a school-grade-based multi-student printable report query
 */
export interface SchoolGradePrintableReportQuery
  extends BatchPrintableReportQuery {
  schoolId: number;
  gradeId: number;
}

/**
 * Represents a district school export report query
 */
export interface DistrictSchoolExportReportQuery extends ExamReportQuery {
  schoolIds?: number[];
  schoolGroupIds?: number[];
  districtIds?: number[];
  districtGroupIds?: number[];
}

/**
 * Base for all aggregate report queries
 */
export interface AggregateReportQuery extends ReportQuery {
  administrativeConditionCodes?: string[];
  assessmentGradeCodes: string[];
  assessmentTypeCode: string;
  completenessCodes?: string[];
  dimensionTypes?: string[];
  includeAllDistricts: boolean;
  includeAllDistrictsOfSchools: boolean;
  includeAllSchoolsOfDistricts: boolean;
  includeState: boolean;
  showEmpty: boolean;
  columnOrder?: string[];
  studentFilters?: AggregateReportStudentFilters;
  schoolIds?: number[];
  districtIds?: number[];

  // not used by target reports
  subjectCodes?: string[];
  achievementLevelDisplayType: string;
  valueDisplayType: string;
  subgroups?: { [key: string]: AggregateReportStudentFilters };
}

/**
 * A basic aggregate report query
 */
export interface CustomAggregateReportQuery extends AggregateReportQuery {
  schoolYears?: number[];
}

/**
 * A longitudinal aggregate report query
 */
export interface LongitudinalReportQuery extends AggregateReportQuery {
  toSchoolYear?: number;
}

/**
 * A claim aggregate report query
 */
export interface ClaimReportQuery extends AggregateReportQuery {
  schoolYears: number[];
  claimCodesBySubject?: any;
}

/**
 * An alt-score aggregate report query
 */
export interface AltScoreReportQuery extends AggregateReportQuery {
  schoolYears: number[];
  altScoreCodesBySubject?: any;
}

/**
 * A target aggregate report query
 */
export interface TargetReportQuery extends AggregateReportQuery {
  schoolYear?: number;
  subjectCode?: string;
}

/**
 * A union of all aggregate report types
 */
export type AggregateReportQueryType =
  | CustomAggregateReportQuery
  | LongitudinalReportQuery
  | ClaimReportQuery
  | AltScoreReportQuery
  | TargetReportQuery;
