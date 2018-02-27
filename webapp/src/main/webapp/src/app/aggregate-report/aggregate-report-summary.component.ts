import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SchoolYearPipe } from "../shared/format/school-year.pipe";
import { AggregateReportOptions } from "./aggregate-report-options";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { AssessmentDefinition } from "./assessment/assessment-definition";
import { Utils } from "../shared/support/support";

const NarrowColumnProvider: ColumnProvider = (organization, assessment, subgroup, filter) =>
  [[organization, assessment], [subgroup, filter]];

const WideColumnProvider: ColumnProvider = (organization, assessment, subgroup, filter) =>
  [[organization], [assessment], [subgroup], [filter]];

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
              private schoolYearPipe: SchoolYearPipe) {
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

    const {assessmentDefinition, options, settings} = this.summary;

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
      includes.push(translate('aggregate-reports-summary.field.include.state-results'));
    }
    if (settings.includeAllDistricts) {
      includes.push(translate('aggregate-reports-summary.field.include.all-districts'));
    }
    if (settings.includeAllSchoolsOfSelectedDistricts) {
      includes.push(translate('aggregate-reports-summary.field.include.all-schools-of-districts'));
    }
    if (settings.includeAllDistrictsOfSelectedSchools) {
      includes.push(translate('aggregate-reports-summary.field.include.all-districts-of-schools'));
    }

    const organizationRows = [
      {
        label: translate('aggregate-reports.form.section.organization.heading'),
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
        label: translate('aggregate-reports.form.section.organization.include.heading'),
        values: includes
      });
    }

    const assessmentRows = [
      {
        label: translate('aggregate-reports.form.field.assessment-type.label'),
        values: [ translate(`common.assessment-type.${settings.assessmentType}.short-name`) ]
      },
      {
        label: translate('aggregate-reports.form.field.subjects.label'),
        values: orAll(options.subjects, settings.subjects, code => translate(`common.subject.${code}.short-name`))
      },
      {
        label: translate('aggregate-reports.form.field.assessment-grades.label'),
        values: inline(orAll(options.assessmentGrades, settings.assessmentGrades, code => translate(`common.grade.${code}.form-name`)))
      },
      {
        label: translate('aggregate-reports.form.field.school-year.label'),
        values: settings.schoolYears.map(value => this.schoolYearPipe.transform(value))
      },
      ...[
        assessmentDefinition.interim
          ? {
            label: translate('aggregate-reports.form.field.interim-administration-condition.label'),
            values: settings.interimAdministrationConditions.map(code => translate(`common.administration-condition.${code}`))
          }
          : {
            label: translate('aggregate-reports.form.field.summative-administration-condition.label'),
            values: settings.summativeAdministrationConditions.map(code => translate(`common.administration-condition.${code}`))
          }
      ],
      {
        label: translate('common.completeness-form-control.label'),
        values: settings.completenesses.map(code => translate(`common.completeness.${code}`))
      }
    ];

    const filterRows = [];
    if (!equalSize(options.genders, settings.genders)) {
      filterRows.push({
        label: translate('aggregate-reports.form.field.gender.label'),
        values: inline(orAll(options.genders, settings.genders, code => translate(`common.gender.${code}`)))
      });
    }
    if (!equalSize(options.ethnicities, settings.ethnicities)) {
      filterRows.push({
        label: translate('aggregate-reports.form.field.ethnicity.label'),
          values: orAll(options.ethnicities, settings.ethnicities, code => translate(`common.ethnicity.${code}`))
      });
    }
    if (!equalSize(options.migrantStatuses, settings.migrantStatuses)) {
      filterRows.push({
        label: translate('aggregate-reports.form.field.migrant-status.label'),
        values: inline(orAll(options.migrantStatuses, settings.migrantStatuses, code => translate(`common.boolean.${code}`)))
      });
    }
    if (!equalSize(options.individualEducationPlans, settings.individualEducationPlans)) {
      filterRows.push({
        label: translate('aggregate-reports.form.field.iep.label'),
        values: inline(orAll(options.individualEducationPlans, settings.individualEducationPlans, code => translate(`common.strict-boolean.${code}`)))
      });
    }
    if (!equalSize(options.section504s, settings.section504s)) {
      filterRows.push({
        label: translate('aggregate-reports.form.field.504.label'),
        values: inline(orAll(options.section504s, settings.section504s, code => translate(`common.boolean.${code}`)))
      });
    }
    if (!equalSize(options.limitedEnglishProficiencies, settings.limitedEnglishProficiencies)) {
      filterRows.push({
        label: translate('aggregate-reports.form.field.limited-english-proficiency.label'),
        values: inline(orAll(options.limitedEnglishProficiencies, settings.limitedEnglishProficiencies, code => translate(`common.boolean.${code}`)))
      });
    }
    if (!equalSize(options.economicDisadvantages, settings.economicDisadvantages)) {
      filterRows.push({
        label: translate('aggregate-reports.form.field.economic-disadvantage.label'),
        values: inline(orAll(options.economicDisadvantages, settings.economicDisadvantages, code => translate(`common.boolean.${code}`)))
      });
    }

    const subgroupRows = [
      {
        label: translate('aggregate-reports.form.field.comparative-subgroup.label'),
        values: orAll(options.dimensionTypes, settings.dimensionTypes, code => translate(`common.dimension.${code}`))
      }
    ];

    this.columns = this._columnProvider(
      {
        label: translate('aggregate-reports.form.section.organization.heading'),
        rows: organizationRows
      },
      {
        label: translate('aggregate-reports.form.section.assessment.heading'),
        rows: assessmentRows
      },
      {
        label: translate('aggregate-reports.form.section.comparative-subgroups.heading'),
        rows: subgroupRows
      },
      {
        label: translate('aggregate-reports.form.section.subgroup-filters.heading'),
        rows: filterRows
      }
    )
    // removes empty columns
    .filter(holder => holder.reduce((totalRows, column) =>  totalRows + column.rows.length, 0) > 0);
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

interface ColumnProvider {
  (organization: Section, assessment: Section, subgroup: Section, filter: Section): Section[][];
}

export interface AggregateReportRequestSummary {
  readonly assessmentDefinition: AssessmentDefinition;
  readonly options: AggregateReportOptions;
  readonly settings: AggregateReportFormSettings;
}

