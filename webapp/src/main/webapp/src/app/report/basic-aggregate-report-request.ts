/**
 * Represents a basic aggregate report request
 */
export interface BasicAggregateReportRequest {
  readonly name: string;
  readonly query: BasicAggregateReportQuery;
}

export interface BasicAggregateReportQuery {

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
  readonly queryType: 'Basic' | 'FilteredSubgroup'; // See AggregateQueryType for possible values
  readonly schoolIds?: number[];
  readonly schoolYears: number[];
  readonly studentFilters?: StudentFilters; // Basic only
  readonly subjectCodes?: string[];
  readonly subgroups?: {[key: string]: StudentFilters}; // FilteredSubgroup only
  readonly valueDisplayType: string;
  readonly columnOrder?: string[];
}

export interface StudentFilters {
  readonly economicDisadvantageCodes?: string[];
  readonly ethnicityCodes?: string[];
  readonly genderCodes?: string[];
  readonly iepCodes?: string[];
  readonly lepCodes?: string[];
  readonly migrantStatusCodes?: string[];
  readonly section504Codes?: string[];
}
