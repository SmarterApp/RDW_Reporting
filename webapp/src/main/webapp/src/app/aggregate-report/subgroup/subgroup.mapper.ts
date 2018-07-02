import { SubgroupFilters } from './subgroup-filters';
import { Utils } from '../../shared/support/support';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DimensionGroup, DimensionValue, Subgroup } from './subgroup';
import { SubgroupItem } from './subgroup-item';
import { AggregateReportRow } from "../../report/aggregate-report";
import { AggregateReportQuery } from "../../report/aggregate-report-request";
import { AggregateReportRequestMapper } from "../aggregate-report-request.mapper";

@Injectable()
export class SubgroupMapper {

  constructor(private translate: TranslateService,
              private requestMapper: AggregateReportRequestMapper) {
  }

  createOverall(): Subgroup {
    return this.createSubgroupInternal([
      {
        type: 'Overall',
        values: []
      }
    ]);
  }

  fromTypeAndCode(type: string, code: string): Subgroup {

    const configuration = DimensionConfigurationByType[ type ];
    const values = configuration != null
      ? [
        {
          code: code,
          translationCode: configuration.getTranslationCode(code)
        }
      ]
      : [];

    return this.createSubgroupInternal([
      {
        type: type,
        values: values
      }
    ]);
  }

  fromFilters(input: SubgroupFilters, dimensionTypes?: string[]): Subgroup {
    const dimensionGroups: DimensionGroup[] = (dimensionTypes || DimensionConfigurations.map(({ type }) => type))
      .reduce((groups, type) => {
        const configuration = DimensionConfigurationByType[ type ];
        const values = (configuration.getDimensionValueCodes(input) || [])
          .map(code => <DimensionValue>{
            code: code,
            translationCode: configuration.getTranslationCode(code)
          });
        if (values.length) {
          groups.push({
            type: type,
            values: values
          });
        }
        return groups;
      }, []);

    return this.createSubgroupInternal(dimensionGroups);
  }

  fromAggregateReportRow(query: AggregateReportQuery, row: AggregateReportRow, overallFlyweight?: Subgroup): Subgroup {
    if (query.subgroups == null) {
      return this.fromTypeAndCode(row.dimension.type, row.dimension.code);
    }
    const serverSubgroup = query.subgroups[ row.dimension.code ];
    return serverSubgroup
      ? this.fromFilters(this.requestMapper.createSubgroupFilters(serverSubgroup))
      : (overallFlyweight || this.createOverall());
  }

  createPermutationsFromFilters(input: SubgroupFilters, dimensionTypes: string[]): Subgroup[] {
    return dimensionTypes
      .map(type => DimensionConfigurationByType[ type ])
      .reduce((subgroups, configuration) => {
        subgroups.push(
          ...(configuration.getDimensionValueCodes(input) || []).map(
            code => this.createSubgroupInternal([
              {
                type: configuration.type,
                values: [
                  {
                    code: code,
                    translationCode: configuration.getTranslationCode(code)
                  }
                ]
              }
            ])
          )
        );
        return subgroups;
      }, []);
  }

  createItemsFromFilters(input: SubgroupFilters, dimensionTypes: string[]): SubgroupItem {
    return {
      source: input,
      subgroup: this.fromFilters(input, dimensionTypes)
    };
  }

  private createSubgroupInternal(dimensionGroups: DimensionGroup[]): Subgroup {
    const translate = code => this.translate.instant(code);
    return {
      id: dimensionGroups
        .map(dimensionGroup => `${dimensionGroup.type}:${dimensionGroup.values.map(value => value.code).join(',')}`)
        .join(';'),
      name: dimensionGroups
        .map(dimensionGroup => {
          const typeName = translate(`common.dimension.${dimensionGroup.type}`);
          const valueNames = dimensionGroup.values
            .map(value => translate(value.translationCode))
            .join(', ');
          return typeName + (valueNames.length ? ': ' : '') + valueNames;
        }).join(', '),
      dimensionGroups: dimensionGroups.concat()
    };
  }

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
    getTranslationCode: value => `common.boolean.${value}`
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
    getTranslationCode: value => `common.boolean.${value}`
  },
  {
    type: 'EconomicDisadvantage',
    getDimensionValueCodes: settings => settings.economicDisadvantages,
    getTranslationCode: value => `common.boolean.${value}`
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

