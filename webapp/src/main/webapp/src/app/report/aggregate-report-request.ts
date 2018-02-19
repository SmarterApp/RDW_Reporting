/**
 * Represents an aggregate report request
 */
export interface AggregateReportRequest {
  readonly name: string;
  readonly reportQuery: AggregateReportQuery
}

export interface AggregateReportQuery {
  readonly achievementLevelDisplayType: string;
  readonly administrativeConditionCodes?: string[];
  readonly assessmentGradeCodes: string[];
  readonly assessmentTypeCode: string;
  readonly completenessCodes?: string[];
  readonly economicDisadvantageCodes?: string[];
  readonly ethnicityCodes?: string[];
  readonly dimensionTypes?: string[];
  readonly districtIds?: number[];
  readonly genderCodes?: string[];
  readonly iepCodes?: string[];
  readonly includeAllDistricts: boolean;
  readonly includeAllDistrictsOfSchools: boolean;
  readonly includeAllSchoolsOfDistricts: boolean;
  readonly includeState: boolean;
  readonly lepCodes?: string[];
  readonly migrantStatusCodes?: string[];
  readonly section504Codes?: string[];
  readonly schoolIds?: number[];
  readonly schoolYears: number[];
  readonly subjectCodes?: string[];
  readonly valueDisplayType: string;
  readonly columnOrder?: string[];
}
