import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SchoolYearPipe } from '../shared/format/school-year.pipe';
import {
  AggregateReportOptions,
  AltScore,
  Claim
} from './aggregate-report-options';
import { AggregateReportFormSettings } from './aggregate-report-form-settings';
import { AssessmentDefinition } from './assessment/assessment-definition';
import { isNullOrEmpty, Utils } from '../shared/support/support';
import { SubgroupMapper } from './subgroup/subgroup.mapper';
import { computeEffectiveYears } from './support';
import { AggregateReportService } from './aggregate-report.service';

const createColumnProvider = (
  columnCount: number = Number.MAX_VALUE
): ColumnProvider => {
  return (...sections) => {
    const sectionsPerColumn = Math.max(
      1,
      Math.round(sections.length / columnCount)
    );
    const parentColumns = [];
    let parentColumnIndex = 0;
    sections.forEach((section, index) => {
      parentColumnIndex =
        index % sectionsPerColumn === 0
          ? ++parentColumnIndex
          : parentColumnIndex;
      const columns = (parentColumns[parentColumnIndex] =
        parentColumns[parentColumnIndex] || []);
      columns.push(section);
    });
    return parentColumns;
  };
};

const equalSize = Utils.hasEqualLength;
const inline = values => [values.join(', ')];
const NarrowColumnProvider: ColumnProvider = createColumnProvider(2);
const WideColumnProvider: ColumnProvider = createColumnProvider();

/**
 * True if the provided options corresponding to a student field aren't null or empty
 * and the query values are not the same as the options
 *
 * @param options The student field filter options
 * @param values The query filter values
 */
function explicitlySet(options: any[], values: any[]): boolean {
  return !isNullOrEmpty(options) && !equalSize(options, values);
}

@Component({
  selector: 'aggregate-report-summary',
  templateUrl: 'aggregate-report-summary.component.html',
  host: {
    class: 'aggregate-report-summary'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AggregateReportSummary {
  columns: Section[][];

  private _summary: AggregateReportRequestSummary;
  private _columnProvider: ColumnProvider = WideColumnProvider;

  constructor(
    private translate: TranslateService,
    private schoolYearPipe: SchoolYearPipe,
    private subgroupMapper: SubgroupMapper,
    private reportService: AggregateReportService
  ) {}

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

  get settings(): AggregateReportFormSettings {
    return this._summary.settings;
  }

  get options(): AggregateReportOptions {
    return this._summary.options;
  }

  get assessmentDefinition(): AssessmentDefinition {
    return this._summary.assessmentDefinition;
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

    const effectiveReportType = this.reportService.getEffectiveReportType(
      settings.reportType,
      assessmentDefinition
    );

    const translate = code => (code ? this.translate.instant(code) : '');

    const All = translate('common.collection-selection.all');
    const None = translate('common.collection-selection.none');

    const orAll = (options, values, codeProvider) =>
      values.length > 0
        ? equalSize(options, values)
          ? [All]
          : values.map(codeProvider)
        : [None];

    const defaultAllOrAll = (options, values, codeProvider) =>
      values.length === 0 ? [All] : orAll(options, values, codeProvider);

    const organizations = settings.districts.concat(settings.schools);

    const includes = [];
    if (!assessmentDefinition.interim && settings.includeStateResults) {
      includes.push(
        translate('aggregate-reports-summary.include-state-results')
      );
    }
    if (settings.includeAllDistricts) {
      includes.push(
        translate('aggregate-reports-summary.include-all-districts')
      );
    }
    if (settings.includeAllSchoolsOfSelectedDistricts) {
      includes.push(
        translate('aggregate-reports-summary.include-all-schools-of-districts')
      );
    }
    if (settings.includeAllDistrictsOfSelectedSchools) {
      includes.push(
        translate('aggregate-reports-summary.include-all-districts-of-schools')
      );
    }

    const organizationRows = [
      {
        label: translate('aggregate-report-form.section.organization.heading'),
        values: [
          organizations.length === 0
            ? None
            : organizations.length === 1
            ? organizations[0].name
            : organizations.length
        ]
      }
    ];

    if (includes.length) {
      organizationRows.push({
        label: translate(
          'aggregate-report-form.section.organization.include.heading'
        ),
        values: includes
      });
    }

    let assessmentAttributes = [];

    const getReportSettings = (reportType: string) => {
      switch (reportType) {
        case 'Claim':
          return this.settings.claimReport;
        case 'AltScore':
          return this.settings.altScoreReport;
        default:
          return this.settings.generalPopulation;
      }
    };

    switch (effectiveReportType) {
      case 'CustomAggregate':
      case 'Claim':
      case 'AltScore':
        const reportSettings = getReportSettings(effectiveReportType);

        assessmentAttributes = [
          {
            label: translate('aggregate-report-form.field.subjects-label'),
            values: orAll(options.subjects, settings.subjects, subject =>
              translate(`subject.${subject.code}.name`)
            )
          },
          {
            label: translate(
              'aggregate-report-form.field.assessment-grades-label'
            ),
            values: inline(
              orAll(
                this.options.assessmentGrades,
                reportSettings.assessmentGrades,
                code => translate(`common.assessment-grade.${code}`)
              )
            )
          },
          {
            label: translate('aggregate-report-form.field.school-years-label'),
            values: reportSettings.schoolYears.map(value =>
              this.schoolYearPipe.transform(value)
            )
          }
        ];
        break;
      case 'Target':
        assessmentAttributes = [
          {
            label: translate('aggregate-report-form.field.subject-label'),
            values: [
              translate(`subject.${settings.targetReport.subjectCode}.name`)
            ]
          },
          {
            label: translate(
              'aggregate-report-form.field.assessment-grade-label'
            ),
            values: [
              translate(
                `common.assessment-grade.${
                  settings.targetReport.assessmentGrade
                }`
              )
            ]
          },
          {
            label: translate('aggregate-report-form.field.school-year-label'),
            values: [
              this.schoolYearPipe.transform(settings.targetReport.schoolYear)
            ]
          }
        ];
        break;
      default:
        assessmentAttributes = [
          {
            label: translate('aggregate-report-form.field.subjects-label'),
            values: orAll(options.subjects, settings.subjects, subject =>
              translate(`subject.${subject.code}.name`)
            )
          },
          {
            label: translate(
              'aggregate-report-form.field.assessment-grades-label'
            ),
            values: inline(
              orAll(
                this.options.assessmentGrades,
                this.settings.longitudinalCohort.assessmentGrades,
                code => translate(`common.assessment-grade.${code}`)
              )
            )
          },
          {
            label: translate('aggregate-report-form.field.school-years-label'),
            values: computeEffectiveYears(
              this.settings.longitudinalCohort.toSchoolYear,
              this.settings.longitudinalCohort.assessmentGrades
            ).map(value => this.schoolYearPipe.transform(value))
          }
        ];
        break;
    }

    const assessmentRows = [
      {
        label: translate('aggregate-report-form.field.assessment-type-label'),
        values: [
          translate(
            `common.assessment-type.${settings.assessmentType}.short-name`
          )
        ]
      },
      ...assessmentAttributes,
      ...[
        assessmentDefinition.interim
          ? {
              label: translate(
                'aggregate-report-form.field.interim-administration-condition-label'
              ),
              values: orAll(
                this.options.interimAdministrationConditions,
                settings.interimAdministrationConditions,
                code => translate(`common.administration-condition.${code}`)
              )
            }
          : {
              label: translate(
                'aggregate-report-form.field.summative-administration-condition-label'
              ),
              values: orAll(
                this.options.summativeAdministrationConditions,
                settings.summativeAdministrationConditions,
                code => translate(`common.administration-condition.${code}`)
              )
            }
      ],
      {
        label: translate('common.completeness-form-control.label'),
        values: orAll(
          this.options.completenesses,
          settings.completenesses,
          code => translate(`common.completeness.${code}`)
        )
      }
    ];

    const claimOrAltScoreRows = [];
    let claimOrAltScoreHeader = '';

    if (effectiveReportType === 'Claim') {
      // TODO: figure out the desired behavior here.
      //  This is effectively always false because it compares the total set of claim codes
      //  from sum and ica against the currently selected ones from either sum or ica.
      //  I suspect it's meant to suppress display if all claims are selected, but it's not
      //  doing that as written.
      if (
        !equalSize(options.claims, settings.claimReport.claimCodesBySubject)
      ) {
        claimOrAltScoreHeader = 'aggregate-report-form.section.claim-heading';
        claimOrAltScoreRows.push({
          label: translate('aggregate-report-form.field.claim-codes-label'),
          values: defaultAllOrAll(
            this.options.claims,
            this.settings.claimReport.claimCodesBySubject,
            (claim: Claim) =>
              translate(`subject.${claim.subject}.claim.${claim.code}.name`)
          )
        });
      }
    }

    if (effectiveReportType === 'AltScore') {
      claimOrAltScoreHeader = 'aggregate-report-form.section.alt-score-heading';
      claimOrAltScoreRows.push({
        label: translate('aggregate-report-form.field.alt-score-codes-label'),
        values: defaultAllOrAll(
          this.options.altScores,
          this.settings.altScoreReport.altScoreCodesBySubject,
          (altScore: AltScore) =>
            translate(`subject.${altScore.subject}.alt.${altScore.code}.name`)
        )
      });
    }

    let variableSections: Section[];

    if (settings.queryType === 'Basic') {
      const subgroupRows = [
        {
          label: translate(
            'aggregate-report-form.field.comparative-subgroup-label'
          ),
          values: orAll(options.dimensionTypes, settings.dimensionTypes, code =>
            translate(`common.dimension.${code}`)
          )
        }
      ];

      const filterRows = [];
      const settingFilters = settings.studentFilters;
      const optionFilters = options.studentFilters;
      if (explicitlySet(optionFilters.genders, settingFilters.genders)) {
        filterRows.push({
          label: translate('common.student-field.Gender'),
          values: inline(
            orAll(optionFilters.genders, settingFilters.genders, code =>
              translate(`common.gender.${code}`)
            )
          )
        });
      }
      if (
        explicitlySet(optionFilters.ethnicities, settingFilters.ethnicities)
      ) {
        filterRows.push({
          label: translate('common.student-field.Ethnicity'),
          values: orAll(
            optionFilters.ethnicities,
            settingFilters.ethnicities,
            code => translate(`common.ethnicity.${code}`)
          )
        });
      }
      if (
        explicitlySet(
          optionFilters.limitedEnglishProficiencies,
          settingFilters.limitedEnglishProficiencies
        )
      ) {
        filterRows.push({
          label: translate('common.student-field.LimitedEnglishProficiency'),
          values: inline(
            orAll(
              optionFilters.limitedEnglishProficiencies,
              settingFilters.limitedEnglishProficiencies,
              code => translate(`common.boolean.${code}`)
            )
          )
        });
      }
      if (
        explicitlySet(
          optionFilters.englishLanguageAcquisitionStatuses,
          settingFilters.englishLanguageAcquisitionStatuses
        )
      ) {
        filterRows.push({
          label: translate(
            'common.student-field.EnglishLanguageAcquisitionStatus'
          ),
          values: orAll(
            optionFilters.englishLanguageAcquisitionStatuses,
            settingFilters.englishLanguageAcquisitionStatuses,
            code => translate(`common.elas.${code}`)
          )
        });
      }
      if (
        explicitlySet(optionFilters.section504s, settingFilters.section504s)
      ) {
        filterRows.push({
          label: translate('common.student-field.Section504'),
          values: inline(
            orAll(optionFilters.section504s, settingFilters.section504s, code =>
              translate(`common.boolean.${code}`)
            )
          )
        });
      }
      if (
        explicitlySet(optionFilters.languages, settingFilters.languages) &&
        settingFilters.languages.length > 0
      ) {
        filterRows.push({
          label: translate('common.student-field.PrimaryLanguage'),
          values: inline(
            orAll(
              optionFilters.languages.map(o => o),
              settingFilters.languages,
              code => translate(`common.languages.${code}`)
            )
          )
        });
      }
      if (
        explicitlySet(
          optionFilters.individualEducationPlans,
          settingFilters.individualEducationPlans
        )
      ) {
        filterRows.push({
          label: translate('common.student-field.IndividualEducationPlan'),
          values: inline(
            orAll(
              optionFilters.individualEducationPlans,
              settingFilters.individualEducationPlans,
              code => translate(`common.strict-boolean.${code}`)
            )
          )
        });
      }
      if (
        explicitlySet(
          optionFilters.migrantStatuses,
          settingFilters.migrantStatuses
        )
      ) {
        filterRows.push({
          label: translate('common.student-field.MigrantStatus'),
          values: inline(
            orAll(
              optionFilters.migrantStatuses,
              settingFilters.migrantStatuses,
              code => translate(`common.boolean.${code}`)
            )
          )
        });
      }
      if (
        explicitlySet(
          optionFilters.economicDisadvantages,
          settingFilters.economicDisadvantages
        )
      ) {
        filterRows.push({
          label: translate('common.student-field.EconomicDisadvantage'),
          values: inline(
            orAll(
              optionFilters.economicDisadvantages,
              settingFilters.economicDisadvantages,
              code => translate(`common.boolean.${code}`)
            )
          )
        });
      }
      if (
        explicitlySet(
          optionFilters.militaryConnectedCodes,
          settingFilters.militaryConnectedCodes
        )
      ) {
        filterRows.push({
          label: translate('common.student-field.MilitaryStudentIdentifier'),
          values: inline(
            orAll(
              optionFilters.militaryConnectedCodes,
              settingFilters.militaryConnectedCodes,
              code => translate(`common.military-connected-code.${code}`)
            )
          )
        });
      }

      variableSections = [
        {
          label: translate(
            'aggregate-report-form.section.comparative-subgroups-heading'
          ),
          rows: subgroupRows
        },
        {
          label: translate(
            'aggregate-report-form.section.subgroup-filters-heading'
          ),
          rows: filterRows
        }
      ];
    } else if (settings.queryType === 'FilteredSubgroup') {
      const subgroups = settings.subgroups;
      variableSections = [
        {
          label: translate(
            'aggregate-report-form.section.comparative-subgroups-heading'
          ),
          rows: [
            {
              label: translate(
                'aggregate-report-form.section.comparative-subgroups-heading'
              ),
              values: [
                subgroups.length === 0
                  ? None
                  : subgroups.length === 1
                  ? this.subgroupMapper.fromFilters(
                      subgroups[0],
                      options.dimensionTypes
                    ).name
                  : subgroups.length
              ]
            }
          ]
        }
      ];
    }

    this.columns = this._columnProvider(
      {
        label: translate('aggregate-report-form.section.report-type-heading'),
        rows: [
          <Row>{
            label: translate(
              'aggregate-report-form.section.report-type-heading'
            ),
            values: [
              translate(
                `common.aggregate-report-type.${settings.reportType}.label`
              )
            ]
          }
        ]
      },
      {
        label: translate('aggregate-report-form.section.organization.heading'),
        rows: organizationRows
      },
      {
        label: translate('aggregate-report-form.section.assessment-heading'),
        rows: assessmentRows
      },
      {
        label: translate(claimOrAltScoreHeader),
        rows: claimOrAltScoreRows
      },
      ...variableSections
    )
      // removes empty columns
      .filter(
        holder =>
          holder.reduce(
            (totalRows, column) => totalRows + column.rows.length,
            0
          ) > 0
      );
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
