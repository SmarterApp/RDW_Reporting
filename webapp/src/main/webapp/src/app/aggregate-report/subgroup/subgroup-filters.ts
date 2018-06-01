import { Utils } from '../../shared/support/support';

export interface SubgroupFilters {

  /**
   * Economic disadvantage result filter
   */
  economicDisadvantages: string[];

  /**
   * Race / Ethnicity result filter
   */
  ethnicities: string[];

  /**
   * Gender result filter
   */
  genders: string[];

  /**
   * Individual education plans result filter
   */
  individualEducationPlans: string[];

  /**
   * English learners result filter
   */
  limitedEnglishProficiencies: string[];

  /**
   * English language acquisition statuses result filter
   */
  englishLanguageAcquisitionStatuses: string[];

  /**
   * Migrant status result filter
   */
  migrantStatuses: string[];

  /**
   * Plan 504 result filter
   */
  section504s: string[];

}

const leftDifference = (a: { [ key: string ]: any }, b: { [ key: string ]: any }): { [ key: string ]: any } => {
  return Object.entries(a).reduce((difference, [ key, value ]) => {
    if (!Utils.equalSets(value, b[ key ])) {
      difference[ key ] = value;
    }
    return difference;
  }, {});
};

export class SubgroupFilterSupport {

  static empty(): SubgroupFilters {
    return {
      economicDisadvantages: [],
      ethnicities: [],
      genders: [],
      individualEducationPlans: [],
      limitedEnglishProficiencies: [],
      englishLanguageAcquisitionStatuses: [],
      migrantStatuses: [],
      section504s: []
    };
  }

  static prune(input: SubgroupFilters): SubgroupFilters {
    return Object.entries(input).reduce((pruned, [ key, value ]) => {
      if (value.length !== 0) {
        pruned[ key ] = value;
      }
      return pruned;
    }, {}) as SubgroupFilters;
  }

  /**
   * @param {SubgroupFilters} a
   * @param {SubgroupFilters} b
   * @returns {boolean} True if the provided filters are equal
   */
  static equals(a: SubgroupFilters, b: SubgroupFilters): boolean {
    return Utils.equalSets(a.genders, b.genders)
      && Utils.equalSets(a.ethnicities, b.ethnicities)
      && Utils.equalSets(a.migrantStatuses, b.migrantStatuses)
      && Utils.equalSets(a.individualEducationPlans, b.individualEducationPlans)
      && Utils.equalSets(a.section504s, b.section504s)
      && Utils.equalSets(a.limitedEnglishProficiencies, b.limitedEnglishProficiencies)
      && Utils.equalSets(a.englishLanguageAcquisitionStatuses, b.englishLanguageAcquisitionStatuses)
      && Utils.equalSets(a.economicDisadvantages, b.economicDisadvantages);
  }

  static copy(input: SubgroupFilters): SubgroupFilters {
    return <SubgroupFilters>{
      economicDisadvantages: input.economicDisadvantages.concat(),
      ethnicities: input.ethnicities.concat(),
      genders: input.genders.concat(),
      individualEducationPlans: input.individualEducationPlans.concat(),
      limitedEnglishProficiencies: input.limitedEnglishProficiencies.concat(),
      englishLanguageAcquisitionStatuses: input.englishLanguageAcquisitionStatuses.concat(),
      migrantStatuses: input.migrantStatuses.concat(),
      section504s: input.section504s.concat()
    };
  }

  static leftDifference(a: SubgroupFilters, b: SubgroupFilters): SubgroupFilters {
    return leftDifference(a, b) as SubgroupFilters;
  }

}






