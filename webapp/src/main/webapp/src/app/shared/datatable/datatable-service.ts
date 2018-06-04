import { Injectable } from '@angular/core';
import { AggregateReportItem } from '../../aggregate-report/results/aggregate-report-item';
import { Table } from 'primeng/table';
import * as _ from 'lodash';
import { BaseColumn } from './base-column.model';

@Injectable()
export class DataTableService {
  /**
   * Calculate the index for each row at which it differs from the data in the previous row.
   * This is used to display a tree-like structure which hides repetitive data in the left-most columns.
   */
  calculateTreeColumns(rows: any[], dataTable: Table, allColumns: BaseColumn[], identityColumns: string[]): number[] {
    const treeColumns = [];
    const pageSize: number = dataTable.rows;
    let previousItem: AggregateReportItem;
    rows.forEach((currentItem: AggregateReportItem, index: number) => {
      treeColumns.push(!previousItem || (index % pageSize == 0)
        ? 0 : this.indexOfFirstUniqueColumnValue(allColumns, identityColumns, previousItem, currentItem)
      );
      previousItem = currentItem;
    });
    return treeColumns;
  }

  /**
   * Gets the index of the first column of a row holding a value that does not
   * match the previous row's value.
   * This only traverses the leading re-orderable columns.
   *
   * @param previousItem  The previous row model
   * @param currentItem   The current row
   * @returns {number}  The differentiating column of the currentItem
   */
  private indexOfFirstUniqueColumnValue(allColumns: BaseColumn[], identityColumns: string[], previousItem: any, currentItem: any): number {
    let index: number;
    for (index = 0; index < identityColumns.length - 1; index++) {
      const column: BaseColumn = allColumns[ index ];
      if (column.id === 'organization') {
        const previousOrg = previousItem.organization;
        const currentOrg = currentItem.organization;
        if (!previousOrg.equals(currentOrg)) {
          break;
        }
      } else {
        const previousValue = _.get(previousItem, column.field); // TODO would be nice if this was based on "sortField" as opposed to field
        const currentValue = _.get(currentItem, column.field);
        if (previousValue !== currentValue) {
          break;
        }
      }
    }
    return index;
  }
}
