/**
 * Represents a basic aggregate report request
 */
export interface AggregateReportRequest {
  readonly name: string;
  readonly query: AggregateReportQuery;
}

/**
 * This is amorphous to support any combination of "queryType" and "reportType"
 */
export interface AggregateReportQuery {

  // Common params
  readonly achievementLevelDisplayType: string;
  readonly administrativeConditionCodes?: string[];
  readonly assessmentGradeCodes: string[];
  readonly assessmentTypeCode: string;
  readonly completenessCodes?: string[];
  readonly dimensionTypes?: string[];
  readonly districtIds?: number[];
  readonly includeAllDistricts: boolean;
  readonly includeAllDistrictsOfSchools: boolean;
  readonly includeAllSchoolsOfDistricts: boolean;
  readonly includeState: boolean;
  readonly schoolIds?: number[];
  readonly subjectCodes?: string[];
  readonly valueDisplayType: string;
  readonly columnOrder?: string[];

  // Basic query type params
  readonly studentFilters?: StudentFilters;

  // FilteredSubgroup query type params
  readonly subgroups?: { [ key: string ]: StudentFilters };

  // Needed for mapping back into form state
  readonly reportType: 'CustomAggregate' | 'Longitudinal' | 'Claim';

  // GeneralPopulation report type params
  readonly schoolYears?: number[];

  // LongitudinalCohort report type params
  readonly toSchoolYear?: number;

  // Claim report type params
  readonly claimCodesBySubject?: any;

  // Target report type params
  readonly schoolYear?: number;
  readonly subjectCode?: string;
}

export interface StudentFilters {
  readonly economicDisadvantageCodes?: string[];
  readonly ethnicityCodes?: string[];
  readonly genderCodes?: string[];
  readonly iepCodes?: string[];
  readonly lepCodes?: string[];
  readonly elasCodes?: string[];
  readonly migrantStatusCodes?: string[];
  readonly section504Codes?: string[];
}
