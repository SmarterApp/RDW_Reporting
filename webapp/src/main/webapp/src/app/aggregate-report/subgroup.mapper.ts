import { SubgroupFilters } from './subgroup-filters';
import { Utils } from '../shared/support/support';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SubgroupFiltersListItem } from './subgroup-filters-list-item';

@Injectable()
export class SubgroupMapper {

  constructor(private translate: TranslateService) {
  }

  createOverallSubgroupFiltersListItem(): SubgroupFiltersListItem {
    return {
      id: '',
      name: this.translate.instant('common.dimension-short-name.Overall'),
      value: undefined
    };
  }

  createSubgroupFiltersListItem(value: SubgroupFilters): SubgroupFiltersListItem {
    const dimensions = this.createDimensions(value);
    return {
      value: value,
      id: dimensions.map(dimension => dimension.id).join(';'),
      name: dimensions.map(dimension => dimension.name).join(', ')
    };
  }

  createDimensions(settings: SubgroupFilters): Dimension[] {
    return DimensionConfigurations.reduce((subgroups, dimension) => {
      const type = dimension.type;
      const valueCodes = dimension.getDimensionValueCodes(settings) || [];
      for (const value of valueCodes) {
        subgroups.push(this.createDimensionInternal(type, value, dimension));
      }
      return subgroups;
    }, []);
  }

  createDimensionPermutations(settings: SubgroupFilters, types: string[]): Dimension[] {
    const subgroups = [];
    for (const type of types) {
      const dimension = DimensionConfigurationByType[ type ];
      if (dimension) {
        const values = dimension.getDimensionValueCodes(settings);
        for (const value of values) {
          subgroups.push(this.createDimensionInternal(type, value, dimension));
        }
      } else {
        subgroups.push(this.createDimensionInternal(type));
      }
    }
    return subgroups;
  }

  createDimension(type: string, value?: any): Dimension {
    return this.createDimensionInternal(type, value, DimensionConfigurationByType[ type ]);
  }

  private createDimensionInternal(type: string, value?: any, dimension?: DimensionConfiguration): Dimension {
    const translate = (code) => this.translate.instant(code);
    const suffix = value && dimension ? `: ${translate(dimension.getTranslationCode(value))}` : '';
    return {
      id: `${type}:${value}`,
      name: `${translate(`common.dimension-short-name.${type}`)}${suffix}`,
      type: type,
      code: value
    };
  }

}

export interface Dimension {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly code: string;
}

interface DimensionConfiguration {
  readonly type: string;
  readonly getDimensionValueCodes: (settings: any) => string[];
  readonly getTranslationCode: (dimensionCode: string) => string;
}

const DimensionConfigurations: DimensionConfiguration[] = [
  {
    type: 'Gender',
    getDimensionValueCodes: settings => settings.genders,
    getTranslationCode: value => `common.gender.${value}`
  },
  {
    type: 'Ethnicity',
    getDimensionValueCodes: settings => settings.ethnicities,
    getTranslationCode: value => `common.ethnicity.${value}`
  },
  {
    type: 'LEP',
    getDimensionValueCodes: settings => settings.limitedEnglishProficiencies,
    getTranslationCode: value => `common.strict-boolean.${value}`
  },
  {
    type: 'ELAS',
    getDimensionValueCodes: settings => settings.englishLanguageAcquisitionStatuses,
    getTranslationCode: value => `common.elas.${value}`
  },
  {
    type: 'MigrantStatus',
    getDimensionValueCodes: settings => settings.migrantStatuses,
    getTranslationCode: value => `common.boolean.${value}`
  },
  {
    type: 'Section504',
    getDimensionValueCodes: settings => settings.section504s,
    getTranslationCode: value => `common.boolean.${value}`
  },
  {
    type: 'IEP',
    getDimensionValueCodes: settings => settings.individualEducationPlans,
    getTranslationCode: value => `common.strict-boolean.${value}`
  },
  {
    type: 'EconomicDisadvantage',
    getDimensionValueCodes: settings => settings.economicDisadvantages,
    getTranslationCode: value => `common.strict-boolean.${value}`
  },
  {
    type: 'StudentEnrolledGrade',
    getDimensionValueCodes: settings => Utils.isNullOrEmpty(settings.assessmentGrades) ? [] : [ settings.assessmentGrades[ 0 ] ],
    getTranslationCode: value => `common.enrolled-grade.${value}`
  }
];


/**
 * Dimension type code to configuration mappings.
 * These configurations help mapping backend-provided and form-provided dimension data into {Dimension}s
 */
const DimensionConfigurationByType: { [ dimensionType: string ]: DimensionConfiguration } = DimensionConfigurations
  .reduce((byType, dimension) => {
    byType[ dimension.type ] = dimension;
    return byType;
  }, {});

