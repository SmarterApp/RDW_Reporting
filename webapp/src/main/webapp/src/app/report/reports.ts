import {
  AggregateReportQuery,
  ClaimReportQuery,
  CustomAggregateReportQuery,
  DistrictSchoolExportReportQuery,
  ExamReportQuery,
  LongitudinalReportQuery,
  PrintableReportQuery,
  ReportQuery,
  TargetReportQuery,
  UserQuery,
  UserReport
} from './report';
import { UserReportService } from './user-report.service';
import { UserQueryService } from './user-query.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { isEqual } from 'lodash';

export function toUserReport(serverReport: any): UserReport {
  return {
    ...serverReport,
    metadata: serverReport.metadata || {}
  };
}

const AggregateReportQueryTypes = [
  'CustomAggregate',
  'Longitudinal',
  'Claim',
  'Target'
];

export function isAggregateReportQueryType(type: string) {
  return AggregateReportQueryTypes.includes(type);
}

/**
 * Normalizes subject codes from each query type into an array for display
 *
 * @param query The query to search for subject codes
 */
export function getSubjectCodes(query: ReportQuery): string[] {
  let subjectCodes = [];
  switch (query.type) {
    case 'Student':
    case 'Group':
    case 'SchoolGrade':
    case 'Target':
      subjectCodes = [
        (<PrintableReportQuery | TargetReportQuery>query).subjectCode
      ];
      break;
    case 'CustomAggregate':
    case 'Longitudinal':
    case 'Claim':
      subjectCodes = (<
        CustomAggregateReportQuery | LongitudinalReportQuery | ClaimReportQuery
      >query).subjectCodes;
      break;
  }
  return subjectCodes.filter(value => value != null);
}

/**
 * Normalizes school years from each query type into an array for display
 *
 * @param query The query to search for school years
 */
export function getSchoolYears(query: ReportQuery): number[] {
  switch (query.type) {
    case 'Student':
    case 'Group':
    case 'SchoolGrade':
    case 'DistrictSchoolExport':
    case 'Target':
      return [
        (<PrintableReportQuery | ExamReportQuery | TargetReportQuery>query)
          .schoolYear
      ];
    case 'CustomAggregate':
    case 'Claim':
      return (<CustomAggregateReportQuery | ClaimReportQuery>query).schoolYears;
    case 'Longitudinal':
      return [(<LongitudinalReportQuery>query).toSchoolYear];
    default:
      return [];
  }
}

/**
 * Takes route query parameters and required services and returns a query source.
 *
 * @param queryParams The route query parameters
 * @param userReportService The user report service
 * @param userQueryService The user query service
 */
export function getQueryFromRouteQueryParameters<T extends ReportQuery>(
  queryParams: { [param: string]: string },
  userReportService: UserReportService,
  userQueryService: UserQueryService
): Observable<T> {
  const { userReportId, userQueryId } = queryParams;
  if (userReportId == null && userQueryId == null) {
    return of(undefined);
  }
  const source: Observable<UserReport | UserQuery> =
    userReportId != null
      ? userReportService.getReport(Number.parseInt(userReportId))
      : userQueryService.getQuery(Number.parseInt(userQueryId));

  return source.pipe(map(({ query }) => <T>query));
}

/**
 * Creates a sorted copy of an array of primitive values.
 * If the passed value is null or undefined it returns the passed value.
 *
 * @param array The array to sort
 */
function sortedCopy<T>(array: T[]): T[] {
  if (array == null) {
    return array;
  }
  return array.slice().sort();
}

/**
 * Creates a copy of an object that holds only arrays.
 * The assumption here is that all of the arrays the object holds are to be treated as Sets
 *
 * @param a The object carrying the arrays
 */
function normalizeArrayHolder<T>(a: { [key: string]: any[] }): T {
  return <T>Object.entries(a).reduce((copy, [key, value]) => {
    copy[key] = sortedCopy(<any[]>value);
    return copy;
  }, {});
}

function normalizeClaimReportQuery(query: ClaimReportQuery): ClaimReportQuery {
  return {
    ...query,
    ...normalizeAggregateReportQuery(query),
    claimCodesBySubject: normalizeArrayHolder(query.claimCodesBySubject)
  };
}

function normalizeDistrictSchoolExport(
  query: DistrictSchoolExportReportQuery
): DistrictSchoolExportReportQuery {
  return {
    ...query,
    schoolIds: sortedCopy(query.schoolIds),
    schoolGroupIds: sortedCopy(query.schoolGroupIds),
    districtIds: sortedCopy(query.districtIds),
    districtGroupIds: sortedCopy(query.districtGroupIds)
  };
}

function normalizeAggregateReportQuery(
  query: AggregateReportQuery
): AggregateReportQuery {
  return {
    ...query,
    administrativeConditionCodes: sortedCopy(
      query.administrativeConditionCodes
    ),
    assessmentGradeCodes: sortedCopy(query.assessmentGradeCodes),
    completenessCodes: sortedCopy(query.completenessCodes),
    dimensionTypes: sortedCopy(query.dimensionTypes),
    districtIds: sortedCopy(query.districtIds),
    schoolIds: sortedCopy(query.schoolIds),
    subgroups:
      query.subgroups != null
        ? Object.entries(query.subgroups).reduce((copy, [key, value]) => {
            copy[key] = normalizeArrayHolder(<any>value);
            return copy;
          }, {})
        : query.subgroups,
    subjectCodes: sortedCopy(query.subjectCodes),
    studentFilters:
      query.studentFilters != null
        ? normalizeArrayHolder(<any>query.studentFilters)
        : query.studentFilters
  };
}

/**
 * Checks recursively for report query equality
 *
 * @param a The first query to compare
 * @param b The second query to compare
 */
export function isEqualReportQuery(a: ReportQuery, b: ReportQuery): boolean {
  if (a.type !== b.type || a.name !== b.name) {
    return false;
  }
  const l: any = a,
    r: any = b;
  switch (a.type) {
    case 'Student':
    case 'SchoolGrade':
    case 'Group':
      return isEqual(l, r);
    case 'DistrictSchoolExport':
      return isEqual(
        normalizeDistrictSchoolExport(l),
        normalizeDistrictSchoolExport(r)
      );
    case 'CustomAggregate':
    case 'Longitudinal':
    case 'Target':
      return isEqual(
        normalizeAggregateReportQuery(l),
        normalizeAggregateReportQuery(r)
      );
    case 'Claim':
      return isEqual(
        normalizeClaimReportQuery(l),
        normalizeClaimReportQuery(r)
      );
  }
  return false;
}
