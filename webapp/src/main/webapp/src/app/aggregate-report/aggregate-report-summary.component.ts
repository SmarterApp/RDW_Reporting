import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SchoolYearPipe } from '../shared/format/school-year.pipe';
import { AggregateReportOptions } from './aggregate-report-options';
import { AggregateReportFormSettings } from './aggregate-report-form-settings';
import { AssessmentDefinition } from './assessment/assessment-definition';
import { Utils } from '../shared/support/support';
import { SubgroupMapper } from './subgroup/subgroup.mapper';
import { computeEffectiveYears } from './support';


const createColumnProvider = (columnCount: number = Number.MAX_VALUE): ColumnProvider => {
  return (...sections) => {
    const sectionsPerColumn = Math.max(1, Math.round(sections.length / columnCount));
    const parentColumns = [];
    let parentColumnIndex = 0;
    sections.forEach((section, index) => {
      parentColumnIndex = index % sectionsPerColumn === 0 ? ++parentColumnIndex : parentColumnIndex;
      const columns = parentColumns[ parentColumnIndex ] = parentColumns[ parentColumnIndex ] || [];
      columns.push(section);
    });
    return parentColumns;
  };
};

const NarrowColumnProvider: ColumnProvider = createColumnProvider(2);
const WideColumnProvider: ColumnProvider = createColumnProvider();

@Component({
  selector: 'aggregate-report-summary',
  templateUrl: 'aggregate-report-summary.component.html',
  host: {
    'class': 'aggregate-report-summary'
  }
})
export class AggregateReportSummary {

  columns: Section[][];

  private _summary: AggregateReportRequestSummary;
  private _columnProvider: ColumnProvider = WideColumnProvider;

  constructor(private translate: TranslateService,
              private schoolYearPipe: SchoolYearPipe,
              private subgroupMapper: SubgroupMapper) {
  }

  get narrow(): any {
    return this._columnProvider === NarrowColumnProvider;
  }

  @Input()
  set narrow(value: any) {
    value = Utils.booleanValueOf(value);
    if (this.narrow !== value) {
      this._columnProvider = value ? NarrowColumnProvider : WideColumnProvider;
      this.updateColumns();
    }
  }

  get summary(): AggregateReportRequestSummary {
    return this._summary;
  }

  @Input()
  set summary(value: AggregateReportRequestSummary) {
    if (this._summary !== value) {
      this._summary = value;
      this.updateColumns();
    }
  }

  updateColumns(): void {

    if (this.summary == null) {
      return;
    }

    const { assessmentDefinition, options, settings } = this.summary;

    const equalSize = Utils.hasEqualLength;
    const translate = code => this.translate.instant(code);

    const All = translate('common.collection-selection.all');
    const None = translate('common.collection-selection.none');

    const orAll = (options, values, codeProvider) => values.length > 0
      ? (equalSize(options, values) ? [ All ] : values.map(codeProvider))
      : [ None ];

    const inline = values => [ values.join(', ') ];

    const organizations = settings.districts.concat(settings.schools);

    const includes = [];
    if (!assessmentDefinition.interim && settings.includeStateResults) {
      includes.push(translate('aggregate-reports-summary.include-state-results'));
    }
    if (settings.includeAllDistricts) {
      includes.push(translate('aggregate-reports-summary.include-all-districts'));
    }
    if (settings.includeAllSchoolsOfSelectedDistricts) {
      includes.push(translate('aggregate-reports-summary.include-all-schools-of-districts'));
    }
    if (settings.includeAllDistrictsOfSelectedSchools) {
      includes.push(translate('aggregate-reports-summary.include-all-districts-of-schools'));
    }

    const organizationRows = [
      {
        label: translate('aggregate-report-form.section.organization.heading'),
        values: [
          organizations.length === 0
            ? None
            : organizations.length === 1
            ? organizations[ 0 ].name
            : organizations.length
        ]
      }
    ];

    if (includes.length) {
      organizationRows.push({
        label: translate('aggregate-report-form.section.organization.include.heading'),
        values: includes
      });
    }

    const assessmentRows = [
      {
        label: translate('aggregate-report-form.field.assessment-type-label'),
        values: [ translate(`common.assessment-type.${settings.assessmentType}.short-name`) ]
      },
      {
        label: translate('aggregate-report-form.field.subjects-label'),
        values: orAll(options.subjects, settings.subjects, code => translate(`common.subject.${code}.short-name`))
      },

      ...(settings.reportType === 'GeneralPopulation' || !assessmentDefinition.aggregateReportLongitudinalCohortEnabled
        ? [
            {
              label: translate('aggregate-report-form.field.assessment-grades-label'),
              values: inline(orAll(options.assessmentGrades, settings.generalPopulation.assessmentGrades, code => translate(`common.assessment-grade.${code}`)))
            },
            {
              label: translate('aggregate-report-form.field.school-year-label'),
              values: settings.generalPopulation.schoolYears.map(value => this.schoolYearPipe.transform(value))
            }
          ]
        : [
            {
              label: translate('aggregate-report-form.field.assessment-grades-label'),
              values: inline(orAll(options.assessmentGrades, settings.longitudinalCohort.assessmentGrades, code => translate(`common.assessment-grade.${code}`)))
            },
            {
              label: translate('aggregate-report-form.field.school-year-label'),
              values: computeEffectiveYears(settings.longitudinalCohort.toSchoolYear, settings.longitudinalCohort.assessmentGrades).map(value => this.schoolYearPipe.transform(value))
            }
        ]),
      ...[
        assessmentDefinition.interim
          ? {
            label: translate('aggregate-report-form.field.interim-administration-condition-label'),
            values: settings.interimAdministrationConditions.map(code => translate(`common.administration-condition.${code}`))
          }
          : {
            label: translate('aggregate-report-form.field.summative-administration-condition-label'),
            values: settings.summativeAdministrationConditions.map(code => translate(`common.administration-condition.${code}`))
          }
      ],
      {
        label: translate('common.completeness-form-control.label'),
        values: settings.completenesses.map(code => translate(`common.completeness.${code}`))
      }
    ];

    let variableSections: Section[];

    if (settings.queryType === 'Basic') {

      const subgroupRows = [
        {
          label: translate('aggregate-report-form.field.comparative-subgroup-label'),
          values: orAll(options.dimensionTypes, settings.dimensionTypes, code => translate(`common.dimension.${code}`))
        }
      ];

      const filterRows = [];
      const settingFilters = settings.studentFilters;
      const optionFilters = options.studentFilters;
      if (!equalSize(optionFilters.genders, settingFilters.genders)) {
        filterRows.push({
          label: translate('aggregate-report-form.field.gender-label'),
          values: inline(orAll(
            optionFilters.genders,
            settingFilters.genders,
            code => translate(`common.gender.${code}`)
          ))
        });
      }
      if (!equalSize(optionFilters.ethnicities, settingFilters.ethnicities)) {
        filterRows.push({
          label: translate('aggregate-report-form.field.ethnicity-label'),
          values: orAll(
            optionFilters.ethnicities,
            settingFilters.ethnicities,
            code => translate(`common.ethnicity.${code}`)
          )
        });
      }
      if (!equalSize(optionFilters.limitedEnglishProficiencies, settingFilters.limitedEnglishProficiencies)) {
        filterRows.push({
          label: translate('aggregate-report-form.field.limited-english-proficiency-label'),
          values: inline(orAll(
            optionFilters.limitedEnglishProficiencies,
            settingFilters.limitedEnglishProficiencies,
            code => translate(`common.boolean.${code}`)
          ))
        });
      }
      if (!equalSize(optionFilters.englishLanguageAcquisitionStatuses, settingFilters.englishLanguageAcquisitionStatuses)) {
        filterRows.push({
          label: translate('aggregate-report-form.field.elas-label'),
          values: orAll(
            optionFilters.englishLanguageAcquisitionStatuses,
            settingFilters.englishLanguageAcquisitionStatuses,
            code => translate(`common.elas.${code}`)
          )
        });
      }
      if (!equalSize(optionFilters.section504s, settingFilters.section504s)) {
        filterRows.push({
          label: translate('aggregate-report-form.field.504-label'),
          values: inline(orAll(
            optionFilters.section504s,
            settingFilters.section504s,
            code => translate(`common.boolean.${code}`)
          ))
        });
      }
      if (!equalSize(optionFilters.individualEducationPlans, settingFilters.individualEducationPlans)) {
        filterRows.push({
          label: translate('aggregate-report-form.field.iep-label'),
          values: inline(orAll(
            optionFilters.individualEducationPlans,
            settingFilters.individualEducationPlans,
            code => translate(`common.strict-boolean.${code}`)
          ))
        });
      }
      if (!equalSize(optionFilters.migrantStatuses, settingFilters.migrantStatuses)) {
        filterRows.push({
          label: translate('aggregate-report-form.field.migrant-status-label'),
          values: inline(orAll(
            optionFilters.migrantStatuses,
            settingFilters.migrantStatuses,
            code => translate(`common.boolean.${code}`)
          ))
        });
      }
      if (!equalSize(optionFilters.economicDisadvantages, settingFilters.economicDisadvantages)) {
        filterRows.push({
          label: translate('aggregate-report-form.field.economic-disadvantage-label'),
          values: inline(orAll(
            optionFilters.economicDisadvantages,
            settingFilters.economicDisadvantages,
            code => translate(`common.boolean.${code}`)
          ))
        });
      }

      variableSections = [
        {
          label: translate('aggregate-report-form.section.comparative-subgroups-heading'),
          rows: subgroupRows
        },
        {
          label: translate('aggregate-report-form.section.subgroup-filters-heading'),
          rows: filterRows
        }
      ];

    } else if (settings.queryType === 'FilteredSubgroup') {

      const subgroups = settings.subgroups;
      variableSections = [
        {
          label: translate('aggregate-report-form.section.comparative-subgroups-heading'),
          rows: [
            {
              label: translate('aggregate-report-form.section.comparative-subgroups-heading'),
              values: [
                subgroups.length === 0
                  ? None
                  : subgroups.length === 1
                  ? this.subgroupMapper.fromFilters(subgroups[0], options.dimensionTypes).name
                  : subgroups.length
              ]
            }
          ]
        }
      ];

    }

    this.columns = this._columnProvider(
      {
        label: translate('aggregate-report-form.section.organization.heading'),
        rows: organizationRows
      },
      {
        label: translate('aggregate-report-form.section.assessment-heading'),
        rows: assessmentRows
      },
      ...variableSections
    )
    // removes empty columns
      .filter(holder => holder.reduce((totalRows, column) => totalRows + column.rows.length, 0) > 0);
  }

}

interface Section {
  readonly label: string;
  readonly rows: Row[];
}

interface Row {
  readonly label: string;
  readonly values: string[];
}

type ColumnProvider = (...sections: Section[]) => Section[][];

export interface AggregateReportRequestSummary {
  readonly assessmentDefinition: AssessmentDefinition;
  readonly options: AggregateReportOptions;
  readonly settings: AggregateReportFormSettings;
}

