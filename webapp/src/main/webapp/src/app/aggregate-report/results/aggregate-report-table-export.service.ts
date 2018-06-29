import { Injectable } from "@angular/core";
import { AggregateReportItem } from "./aggregate-report-item";
import { CsvBuilder } from "../../csv-export/csv-builder.service";
import { TranslateService } from "@ngx-translate/core";
import { AssessmentDefinition } from "../assessment/assessment-definition";
import { PerformanceLevelDisplayTypes } from "../../shared/display-options/performance-level-display-type";
import { ValueDisplayTypes } from "../../shared/display-options/value-display-type";
import { AggregateReportType } from "../aggregate-report-form-settings";
import { SubjectDefinition } from '../../subject/subject';

/**
 * Service responsible for exporting the currently-viewed aggregate report table
 * as a CSV in the same order and format as the table.
 */
@Injectable()
export class AggregateReportTableExportService {

  constructor(private csvBuilder: CsvBuilder,
              private translateService: TranslateService) {
  }

  /**
   * Export the given rows to a CSV.
   *
   * @param {AggregateReportItem[]} rows  The table rows (sorted)
   * @param {ExportOptions} options       The table visual settings and export options
   */
  public exportTable(rows: AggregateReportItem[], options: ExportOptions): void {

    let builder: CsvBuilder = this.csvBuilder
      .newBuilder()
      .withFilename(options.name);

    options.columnOrdering.forEach((column) => {
      builder = this.appendUserOrderedColumn(column, options, builder);
    });

    builder
      .withColumn(
        this.translateService.instant('aggregate-report-table.columns.students-tested'),
        (item: AggregateReportItem) => item.studentsTested
      );

    if (options.reportType === AggregateReportType.Target) {
      builder
        .withColumn(
          this.translateService.instant('target-report.columns.student-relative-residual-scores-level'),
          (item: AggregateReportItem) => {
            if (!item.studentsTested) return '';

            return this.translateService.instant(`aggregate-report-table.target.overall.${item.studentRelativeResidualScoresLevel}`);
          }
        )
        .withColumn(
          this.translateService.instant('target-report.columns.standard-met-relative-residual-level'),
          (item: AggregateReportItem) => {
            if (!item.studentsTested) return '';

            return this.translateService.instant(`aggregate-report-table.target.standard.${item.standardMetRelativeResidualLevel}`);
          }
        );

    } else if (options.reportType === AggregateReportType.Claim) {
      this.addPerformanceLevelColumns(builder, options);

    } else {
      builder
        .withColumn(
          this.translateService.instant('aggregate-report-table.columns.avg-scale-score'),
          (item: AggregateReportItem) => item.studentsTested
            ? `${item.avgScaleScore} ± ${item.avgStdErr}`
            : ''
        );

      this.addPerformanceLevelColumns(builder, options);
    }

    builder.build(rows);
  }

  private appendUserOrderedColumn(column: string, options: ExportOptions, builder: CsvBuilder): CsvBuilder {
    if ('organization' === column) {
      return builder
        .withColumn(
          this.translateService.instant('aggregate-report-table.columns.organization'),
          (item: AggregateReportItem) => item.organization.name
        )
        .withColumn(
          this.translateService.instant('aggregate-report-table.columns.organization-id'),
          (item: AggregateReportItem) => (item.organization as any).naturalId ? (item.organization as any).naturalId : ''
        );
    }

    if ('assessmentLabel' === column) {
      return builder
        .withColumn(
          this.translateService.instant('aggregate-report-table.columns.assessment-label'),
          (item: AggregateReportItem) => item.assessmentLabel
        );
    }

    if ('assessmentGrade' === column) {
      return builder
        .withColumn(
          this.translateService.instant('aggregate-report-table.columns.assessment-grade'),
          (item: AggregateReportItem) => this.translateService.instant(`common.assessment-grade.${item.assessmentGradeCode}`)
        );
    }

    if ('schoolYear' === column) {
      return builder
        .withColumn(
          this.translateService.instant('aggregate-report-table.columns.school-year'),
          (item: AggregateReportItem) => {
            const valueAsString = item.schoolYear.toString();
            if (valueAsString.length !== 4) {
              return item.schoolYear;
            }
            return `${item.schoolYear - 1}-${valueAsString.substring(2)}`;
          }
        );
    }

    if ('dimension' === column) {
      return builder
        .withColumn(
          this.translateService.instant('aggregate-report-table.columns.dimension'),
          (item: AggregateReportItem) => item.subgroup.name);
    }

    if ('claim' === column) {
      return builder
        .withColumn(
          this.translateService.instant('aggregate-report-table.columns.claim'),
          (item: AggregateReportItem) => {
            const translationKey: string = options.reportType === AggregateReportType.Target
              ? `common.claim-name.${item.claimCode}`
              : `subject.${item.subjectCode}.claim.${item.claimCode}.name`;
            return this.translateService.instant(translationKey);
          }
        )
    }

    if ('target' === column) {
      return builder
        .withColumn(
          this.translateService.instant('aggregate-report-table.columns.target'),
          (item: AggregateReportItem) => {
            return this.translateService.instant(`subject.${item.subjectCode}.claim.${item.claimCode}.target.${item.targetNaturalId}.name`);
          }
        )
    }
  }

  private addPerformanceLevelColumns(builder: CsvBuilder, options: ExportOptions): CsvBuilder {
    const dataProviderForPerformanceLevel = (levelIndex: number) =>
      (item: AggregateReportItem) => {
        if (!item.studentsTested) {
          return '';
        }

        const value: number = item.performanceLevelByDisplayTypes
          [options.performanceLevelDisplayType]
          [options.valueDisplayType]
          [levelIndex];
        return options.valueDisplayType === ValueDisplayTypes.Percent
          ? value + '%'
          : value;
      };

    const headerForPerformanceLevel = (level: number) => {
      let header: string;
      if (options.performanceLevelDisplayType === PerformanceLevelDisplayTypes.Grouped) {
        header = this.translateService.instant(`aggregate-report-table.columns.grouped-performance-level-prefix.${level}`);
      } else {
        header = this.translateService.instant(`subject.${options.subjectDefinition.subject}.asmt-type.${options.subjectDefinition.assessmentType}.level.${level}.short-name`);
      }
      const suffix = this.translateService.instant(`subject.${options.subjectDefinition.subject}.asmt-type.${options.subjectDefinition.assessmentType}.level.${level}.suffix`);
      return header + (suffix ? ' ' + suffix : '');
    };

    const levels: number[] = options.performanceLevelDisplayType === PerformanceLevelDisplayTypes.Grouped
      ? [0, 1]
      : options.subjectDefinition.performanceLevels;

    for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
      builder = builder
        .withColumn(
          headerForPerformanceLevel(levels[levelIndex]),
          dataProviderForPerformanceLevel(levelIndex)
        );
    }

    return builder;
  }
}

export interface ExportOptions {
  readonly valueDisplayType: string;
  readonly performanceLevelDisplayType: string;
  readonly columnOrdering: string[];
  readonly subjectDefinition: SubjectDefinition;
  readonly name: string;
  readonly reportType: AggregateReportType
}
