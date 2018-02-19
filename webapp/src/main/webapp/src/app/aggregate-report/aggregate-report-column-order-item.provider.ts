import { Injectable } from "@angular/core";
import { OrderableItem } from "../shared/order-selector/order-selector.component";

const ColumnToLabel: {[key: string]: string} = {
  organization: 'aggregate-reports.results.cols.organization-name',
  assessmentGrade: 'aggregate-reports.results.cols.assessment-grade',
  schoolYear: 'aggregate-reports.results.cols.school-year',
  dimension: 'aggregate-reports.results.cols.dimension'
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
