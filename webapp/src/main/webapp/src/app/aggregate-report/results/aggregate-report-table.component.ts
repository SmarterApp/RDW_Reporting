import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Ordering, ordering } from "@kourge/ordering";
import { AggregateReportItem } from "./aggregate-report-item";
import { byNumber, byString, Comparator, join, ranking } from "@kourge/ordering/comparator";
import { ColorService } from "../../shared/color.service";
import { Column, DataTable } from "primeng/primeng";
import { isNullOrUndefined } from "util";
import * as _ from "lodash";
import { AssessmentDefinition } from "../assessment/assessment-definition";
import { District, OrganizationType, School } from "../../shared/organization/organization";

export const SupportedRowCount = 10000;

const OrderingDimensionType: Ordering<AggregateReportItem> = ordering(
  ranking([ 'Overall', 'Gender', 'Ethnicity' ]) // TODO should be informed by report options
).on((item) => item.dimensionType);

const OrderingDimensionValue: Ordering<AggregateReportItem> = ordering(byString)
  .on((item) => item.dimensionValue.toString());

const OrderingOrganizationState: Ordering<AggregateReportItem> = ordering(
  ranking([OrganizationType.State])
).reverse().on((item) => {
  return item.organization.type
});

const OrderingOrganizationDistrictsWithSchoolsById: Ordering<AggregateReportItem> = ordering(byNumber)
  .on((item) => {
    switch(item.organization.type) {
      case OrganizationType.District:
        return (item.organization as District).id;
      case OrganizationType.School:
        return (item.organization as School).districtId;
      default:
        return -1;
    }
});

const OrderingOrganizationDistrict: Ordering<AggregateReportItem> = ordering(
  ranking([OrganizationType.District])
).reverse().on((item) => item.organization.type);

const OrderingOrganizationSchools: Ordering<AggregateReportItem> = ordering(byString)
  .on((item) => item.organization.name);

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
  selector: 'aggregate-report-table',
  templateUrl: 'aggregate-report-table.component.html',
})
export class AggregateReportTableComponent implements OnInit {

  @Input()
  public dimensionRanking: string[] = [];


  /**
   * The report data.
   */
  @Input()
  public set table(value: AggregateReportTable) {
    this._table = value;
    this.buildDistrictIdToNameMap(value.rows);
  }

  public get table(): AggregateReportTable {
    return this._table;
  }

  /**
   * True if performance aggregate values should be displayed as percentages of total
   * students tested.  False to display absolute counts.
   */
  @Input()
  public showValuesAsPercent: boolean;

  /**
   * The tree column ordering as an array of field strings.
   * e.g. ['organization', 'assessmentGrade', 'schoolYear', 'dimension']
   */
  @Input()
  public columnOrdering: string[];

  /**
   * True if performance levels should be grouped based upon the performance level rollup.
   */
  @Input()
  public groupPerformanceLevels: boolean;

  @Input()
  public previewOnly: boolean = false;

  @ViewChild("datatable")
  private resultsTable: DataTable;

  public treeColumns: number[] = [];
  public performanceLevels: number[] = [];
  public performanceLevelTranslationPrefix: string;
  public loading: boolean = true;

  private orderingByProperty: { [key: string]: Ordering<AggregateReportItem> } = {};
  private previousSort: any;
  private _table: AggregateReportTable;
  private districtIdToName: Map<number, string> = new Map();

  constructor(public colorService: ColorService) {
  }

  ngOnInit(): void {
    this.orderingByProperty.organization = ordering(join(
      OrderingOrganizationState.compare,
      this.orderingOrganizationDistrictsWithSchoolsByName().compare,
      OrderingOrganizationDistrictsWithSchoolsById.compare,
      OrderingOrganizationDistrict.compare,
      OrderingOrganizationSchools.compare
    ));
    this.orderingByProperty.assessmentGrade = ordering(byString).on(item => item.gradeCode);
    this.orderingByProperty.schoolYear = ordering(byNumber).on(item => item.schoolYear);
    this.orderingByProperty.dimension = ordering(join(
      ordering(ranking([ 'Overall', ...this.dimensionRanking ])).on((item: AggregateReportItem) => item.dimensionType).compare,
      ordering(byString).on((item: AggregateReportItem) => item.dimensionValue.toString()).compare
    ));

    this.performanceLevelTranslationPrefix = `common.assessment-type.${this.table.assessmentDefinition.typeCode}.performance-level.`;
    for (let level = 1; level <= this.table.assessmentDefinition.performanceLevelCount; level++) {
      this.performanceLevels.push(level);
    }

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

      this.resultsTable.value = this.table.rows;
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
    this.table.rows.sort(join.apply(null, ordering));
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
    let rowOrdering: Ordering<AggregateReportItem> = this.orderingByProperty[ field ];
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
      .map(column => this.orderingByProperty[ column.field ] ? this.orderingByProperty[ column.field ].compare : null)
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
    this.table.rows.forEach((item: AggregateReportItem, idx: number) => {
      if (!previousItem || idx % pageSize == 0) {
        this.treeColumns.push(0);
      } else {
        let colIdx: number;
        for (colIdx = 0; colIdx < this.columnOrdering.length - 1; colIdx++) {
          let column: Column = this.resultsTable.columns[ colIdx ];
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

  private buildDistrictIdToNameMap(items: AggregateReportItem[]) {
    this.districtIdToName.clear();
    items.forEach(item => {
      if (item.organization.type != OrganizationType.District) {
        return;
      }
      const district: District = item.organization as District;
      this.districtIdToName.set(district.id, district.name)
    });
  }

  private orderingOrganizationDistrictsWithSchoolsByName(): Ordering<AggregateReportItem> {
    return ordering(byString)
      .on((item) => {
        switch(item.organization.type) {
          case OrganizationType.District:
            return this.districtIdToName.get((item.organization as District).id) || "";
          case OrganizationType.School:
            return this.districtIdToName.get((item.organization as School).districtId) || "";
          default:
            return "";
        }
      });
  }
}


export interface AggregateReportTable {
  readonly subjectCode: string;
  readonly assessmentDefinition: AssessmentDefinition;
  readonly rows: AggregateReportItem[];
}

