import { Injectable } from "@angular/core";
import { OrderableItem } from "../shared/order-selector/order-selector.component";

const ColumnToLabel: {[key: string]: string} = {
  organization: 'aggregate-report-table.columns.organization',
  assessmentLabel: 'aggregate-report-table.columns.assessment-label',
  assessmentGrade: 'aggregate-report-table.columns.assessment-grade',
  schoolYear: 'aggregate-report-table.columns.school-year',
  dimension: 'aggregate-report-table.columns.dimension',
  claim: 'aggregate-report-table.columns.claim'
};

/**
 * Responsible for providing {@link OrderableItem} representations
 * of aggregate report table columns.
 */
@Injectable()
export class AggregateReportColumnOrderItemProvider {

  /**
   * Map the given column ids to OrderableItems.
   *
   * @param {string[]} columnIds  The column ids
   * @returns {OrderableItem[]}   The orderable items representing the columns
   */
  toOrderableItems(columnIds: string[]): OrderableItem[] {
    return columnIds.map(column => {
      return {
        value: column,
        labelKey: ColumnToLabel[column]
      };
    });
  }
}
