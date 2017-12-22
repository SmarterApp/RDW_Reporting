import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Ordering, ordering } from "@kourge/ordering";
import { AggregateReportItem } from "../model/aggregate-report-item.model";
import { AssessmentType } from "../../shared/enum/assessment-type.enum";
import { byNumber, byString, Comparator, join, ranking } from "@kourge/ordering/comparator";
import { ColorService } from "../../shared/color.service";
import { Column, DataTable } from "primeng/primeng";
import { isNullOrUndefined } from "util";
import * as _ from "lodash";
import { AssessmentDetailsService } from "./assessment-details.service";
import { AggregateReportQuery } from "../model/aggregate-report-query.model";

/**
 * This component is responsible for displaying a table of aggregate report results
 * scoped to a single AssessmentType and Subject.
 * The table consists of two types of columns:
 *   tree columns - these data identity columns are used to organize data into a
 *                  hierarchical view based upon the order of the columns
 *   data columns - these columns display averages/counts/performance levels for the
 *                  identified subject group
 */
@Component({
  selector: 'aggregate-reports-table',
  templateUrl: './aggregate-reports-table.component.html',
})
export class AggregateReportsTableComponent implements OnInit {
  private static OrderingDimensionType: Ordering<AggregateReportItem> = ordering(ranking(['Overall', 'Gender', 'Ethnicity'])).on((item) => item.dimensionType);
  private static OrderingDimensionValue: Ordering<AggregateReportItem> = ordering(byString).on((item) => item.dimensionValue);

  /**
   * True if performance aggregate values should be displayed as percentages of total
   * students tested.  False to display absolute counts.
   */
  @Input()
  public showValuesAsPercent: boolean;

  /**
   * The report request query containing additional information on the report data.
   */
  @Input()
  public query: AggregateReportQuery;

  /**
   * The tree column ordering as an array of field strings.
   * e.g. ['organizationName', 'gradeId', 'schoolYear', 'dimensionValue']
   */
  @Input()
  public columnOrdering: string[];

  /**
   * The report data.
   */
  @Input()
  public reportItems: AggregateReportItem[];

  /**
   * True if performance levels should be grouped based upon the performance level rollup.
   */
  @Input()
  public groupPerformanceLevels: boolean;

  @ViewChild("table")
  private resultsTable: DataTable;

  public treeColumns: number[] = [];
  public performanceLevels: number[] = [];
  public performanceLevelTranslationPrefix: string;
  public loading: boolean = true;

  private orderingByProperty: {[key: string]: Ordering<AggregateReportItem>} = {};
  private previousSort: any;
  private performanceRollup: number;

  constructor(public colorService: ColorService,
              private assessmentDetailsService: AssessmentDetailsService) {
    this.orderingByProperty.organizationName = ordering(byString).on((item) => item.organizationName);
    this.orderingByProperty.gradeId = ordering(byNumber).on((item) => item.gradeId);
    this.orderingByProperty.schoolYear = ordering(byNumber).on((item) => item.schoolYear);
    this.orderingByProperty.dimensionValue = ordering(join.apply(null, [
      AggregateReportsTableComponent.OrderingDimensionType.compare,
      AggregateReportsTableComponent.OrderingDimensionValue.compare
    ]));
  }

  ngOnInit(): void {
    this.performanceLevelTranslationPrefix = 'enum.' +
      (this.query.assessmentType == AssessmentType.IAB ? 'iab-category' : 'achievement-level') +
      '.short.';

    this.assessmentDetailsService.getDetails(this.query.assessmentType).subscribe((details) => {
      for (let level = 1; level <= details.performanceLevels; level++) {
        this.performanceLevels.push(level);
      }
      this.performanceRollup = details.performanceRollup;
    });

    // Give the datatable a chance to initialize, run this next frame
    setTimeout(() => {
      this.updateColumnOrder();
      this.sort();
      this.calculateTreeColumns();

      this.resultsTable.cols.changes.subscribe(() => {
        this.updateColumnOrder();
        this.sort(this.previousSort);
        this.calculateTreeColumns();
      });

      this.resultsTable.value = this.reportItems;
      this.loading = false;
    }, 0);
  }

  /**
   * Given a row item, provide a unique item identifier.
   * This is used under the covers by the PrimeNG DataTable to slightly improve
   * rendering performance if a row shifted within the rendered table without being
   * removed/added.
   *
   * @param {number} index              The row index
   * @param {AggregateReportItem} item  The report row item
   * @returns {number}  A unique row item identifier
   */
  public rowTrackBy(index: number, item: AggregateReportItem): number {
    return item.itemId;
  }

  /**
   * Event listener that recalculates tree columns whenever the
   * DataTable is paged or the results to display per-page is changed.
   *
   * @param event A page event
   */
  public onPage(event: any): void {
    this.calculateTreeColumns();
  }

  /**
   * Sort the data by the event's column first, then by default column-ordered sorting.
   * Attempt to preserve as much of the tree structure as possible.
   *
   * @param event {{order: number, field: string}} An optional sort event
   */
  public sort(event?: any): void {
    let ordering: Comparator<AggregateReportItem>[] = this.getColumnOrdering();

    if (event &&
      ( !this.previousSort ||
        event.order != 1 ||
        event.field != this.previousSort.field
      )) {
      // Standard column sort.  Sort on the selected column first, then default sorting.
      ordering.unshift(this.getComparator(event.field, event.order));
      this.previousSort = event;
    }
    else {
      //This is the third time sorting on the same column, reset to default sorting
      this.previousSort = null;
      this.resultsTable.reset();
    }

    //Sort the data based upon the ordered list of Comparators
    this.reportItems.sort(join.apply(null, ordering));
    this.calculateTreeColumns();
  }

  /**
   * Retrieve the current display index of the given column.
   *
   * @param {Column} column A PrimeNG Column instance
   * @returns {number}  The current display index of the column
   */
  public colIndex(column: Column): number {
    return this.resultsTable.columns.indexOf(column);
  }

  /**
   * Modify the PrimeNG DataTable to display tree columns in the order specified by
   * {@link #columnOrdering}
   */
  private updateColumnOrder(): void {
    let columns: Column[] = this.resultsTable.columns.splice(0, this.columnOrdering.length);
    let columnOrdering: Ordering<Column> = ordering(ranking(this.columnOrdering)).on((column) => column.field);
    columns.sort(columnOrdering.compare);
    for (let i = columns.length - 1; i >= 0; i--) {
      this.resultsTable.columns.unshift(columns[ i ]);
    }
  }

  /**
   * Given a column field, return a Comparator used to sort on the given field.
   * NOTE: This assumes any non-tree column is a *number* value.  If we add a non-tree non-number
   * column, this will need some additional Comparator complexity.
   *
   * @param {string} field  A data field/property
   * @param {number} order  The sort order (1 for asc, -1 for desc)
   * @returns {Comparator<AggregateReportItem>} A Comparator for ordering results by the given field
   */
  private getComparator(field: string, order: number): Comparator<AggregateReportItem> {
    let rowOrdering: Ordering<AggregateReportItem> = this.orderingByProperty[field];
    if (!rowOrdering) {
      rowOrdering = ordering(byNumber).on((item) => _.get(item, field, 0));
    }

    return order < 0 ? rowOrdering.reverse().compare : rowOrdering.compare;
  }

  /**
   * Get the ordered list of Comparators that result in a tree-like display.
   * The order of Comparators depends upon the column order.
   *
   * @returns {Comparator<AggregateReportItem>[]} The ordered list of comparators
   */
  private getColumnOrdering(): Comparator<AggregateReportItem>[] {
    return this.resultsTable.columns
      .map(column => this.orderingByProperty[column.field] ? this.orderingByProperty[column.field].compare : null)
      .filter(value => !isNullOrUndefined(value));
  }

  /**
   * Calculate the index for each row at which it differs from the data in the previous row.
   * This is used to display a tree-like structure which hides repetitive data in the left-most columns.
   */
  private calculateTreeColumns(): void {
    let pageSize: number = this.resultsTable.rows;
    this.treeColumns = [];
    let previousItem: AggregateReportItem;
    this.reportItems.forEach((item: AggregateReportItem, idx: number) => {
      if (!previousItem || idx % pageSize == 0) {
        this.treeColumns.push(0);
      } else {
        let colIdx: number;
        for (colIdx = 0; colIdx < this.columnOrdering.length - 1; colIdx++) {
          let column: Column = this.resultsTable.columns[colIdx];
          let previousValue = _.get(previousItem, column.field);
          let currentValue = _.get(item, column.field);
          if (previousValue != currentValue) {
            break;
          }
        }
        this.treeColumns.push(colIdx);
      }

      previousItem = item;
    });
  }
}
