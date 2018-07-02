import { District, Organization, OrganizationType, School } from '../shared/organization/organization';
import { Ordering, ordering } from '@kourge/ordering';
import { byNumber, byString, join, ranking } from '@kourge/ordering/comparator';
import { AggregateReportOptions } from './aggregate-report-options';
import { Subgroup } from './subgroup/subgroup';

const OverallDimensionType: string = 'Overall';

/**
 * @param {number} endYear The year to start the list with
 * @param {string[]} gradeCodes The consecutive grade codes covered by the report
 * @returns {number[]} an array of years starting with the end year followed by the expected years corresponding to the grades
 */
export function computeEffectiveYears(endYear: number, gradeCodes: string[]): number[] {
  // This is not foolproof and assumes each grade code can be parsed into a numeric value
  return gradeCodes
    .map(code => Number.parseInt(code))
    .sort((a, b) => b - a)
    .map((grade, index, grades) => endYear - (grades[ 0 ] - grade));
}

/**
 * @param {(item: T) => Organization} organizationGetter method accepting an element of the elements to sort that returns that element's organization
 * @param {T[]} items all items to be compared. This is needed to successfully order schools grouped by district
 * @returns {Ordering<T>} creates natural organization ordering
 */
export function organizationOrdering<T>(organizationGetter: (item: T) => Organization, items: T[]): Ordering<T> {

  const districtNamesById = items.reduce((districtNamesById: Map<number, string>, item: T) => {
    const organization = organizationGetter(item);
    if (organization.type === OrganizationType.District) {
      districtNamesById.set((<District>organization).id, organization.name);
    }
    return districtNamesById;
  }, new Map());

  const stateOrdering = ordering(ranking([ OrganizationType.State ]))
    .reverse()
    .on((item: T) => organizationGetter(item).type);

  const districtsWithSchoolsByName = ordering(byString)
    .on((item: T) => {
      const organization = organizationGetter(item);
      switch (organization.type) {
        case OrganizationType.District:
          return districtNamesById.get((<District>organization).id) || '';
        case OrganizationType.School:
          return districtNamesById.get((<School>organization).districtId) || '';
        default:
          return '';
      }
    });

  const districtsWithSchoolsByIdOrdering = ordering(byNumber)
    .on((item: T) => {
      const organization = organizationGetter(item);
      switch (organization.type) {
        case OrganizationType.District:
          return (<District>organization).id;
        case OrganizationType.School:
          return (<School>organization).districtId;
        default:
          return -1;
      }
    });

  const districtOrdering = ordering(ranking([ OrganizationType.District ]))
    .reverse()
    .on((item: T) => organizationGetter(item).type);

  const schoolOrdering = ordering(byString)
    .on((item: T) => organizationGetter(item).name);

  return ordering(
    join(
      stateOrdering.compare,
      districtsWithSchoolsByName.compare,
      districtsWithSchoolsByIdOrdering.compare,
      districtOrdering.compare,
      schoolOrdering.compare
    )
  );
}


export function subgroupOrdering<T>(subgroupGetter: (item: T) => Subgroup, options: AggregateReportOptions): Ordering<T> {

  const dimensionOptionsByDimensionType = {
    Gender: getNullableOption(options.studentFilters.genders),
    Ethnicity: options.studentFilters.ethnicities,
    LEP: getNullableOption(options.studentFilters.limitedEnglishProficiencies),
    ELAS: options.studentFilters.englishLanguageAcquisitionStatuses,
    MigrantStatus: options.studentFilters.migrantStatuses,
    Section504: options.studentFilters.section504s,
    IEP: getNullableOption(options.studentFilters.individualEducationPlans),
    EconomicDisadvantage: getNullableOption(options.studentFilters.economicDisadvantages)
  };

  const dimensionTypeAndCodeRankingValues = options.dimensionTypes.reduce((ranking, dimensionType) => {
    return ranking.concat(
      (dimensionOptionsByDimensionType[ dimensionType ] || []).map(dimensionCode => `${dimensionType}:${dimensionCode}`)
    );
  }, []);

  const dimensionTypeAndCodeOrdering = ordering(ranking(
    [ OverallDimensionType, ...dimensionTypeAndCodeRankingValues ]
  )).on((item: T) => subgroupGetter(item).id);

  // Attempt to sort based upon the enrolled grade code as a number ("01", "02", "KG", "UG", etc)
  // If the code cannot be parsed as a number, the order is undefined
  // TODO we should have a specific ordering for all grade codes, although the system only currently uses "03" - "12"
  const enrolledGradeOrdering = ordering(byNumber)
    .on((item: T) => {
      const subgroup = subgroupGetter(item);
      if (subgroup == null || subgroup.dimensionGroups.length == 0) {
        return -1;
      }
      const { type, values } = subgroup.dimensionGroups[0];
      if (type == null || type !== 'StudentEnrolledGrade') {
        return -1;
      }
      try {
        return Number.parseInt(values[ 0 ].code);
      } catch (error) {
        return 1;
      }
    });

  return ordering(join(
    dimensionTypeAndCodeOrdering.compare,
    enrolledGradeOrdering.compare,
    // hotfix Overall order on FilteredSubgroup results
    (a: T, b: T) => {
      if (subgroupGetter(a).id === subgroupGetter(b).id
        &&  subgroupGetter(a).id === 'Overall:') {
        return 0;
      }
      if (subgroupGetter(a).id === 'Overall:') {
        return -1;
      }
      if (subgroupGetter(b).id === 'Overall:') {
        return 1;
      }
      return 0;
    },
    ordering(byString).on((item: T) => subgroupGetter(item).id).compare
  ));
}

function getNullableOption(option: string[]) {
  return option.concat('undefined');
}
