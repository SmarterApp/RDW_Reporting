import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Ordering, ordering } from "@kourge/ordering";
import { AggregateReportItem } from "./aggregate-report-item";
import { byNumber, byString, Comparator, join, ranking } from "@kourge/ordering/comparator";
import { ColorService } from "../../shared/color.service";
import { Column, DataTable } from "primeng/primeng";
import * as _ from "lodash";
import { AssessmentDefinition } from "../assessment/assessment-definition";
import { District, OrganizationType, School } from "../../shared/organization/organization";
import { Utils } from "../../shared/support/support";
import { AggregateReportOptions } from "../aggregate-report-options";

export const SupportedRowCount = 10000;

const OverallDimensionType: string = 'Overall';

const StateOrdering: Ordering<AggregateReportItem> = ordering(ranking([ OrganizationType.State ]))
  .reverse()
  .on(item => item.organization.type);

const DistrictsWithSchoolsByIdOrdering: Ordering<AggregateReportItem> = ordering(byNumber)
  .on(item => {
    switch (item.organization.type) {
      case OrganizationType.District:
        return (item.organization as District).id;
      case OrganizationType.School:
        return (item.organization as School).districtId;
      default:
        return -1;
    }
  });

const DistrictOrdering: Ordering<AggregateReportItem> = ordering(ranking([ OrganizationType.District ]))
  .reverse()
  .on(item => item.organization.type);

const SchoolOrdering: Ordering<AggregateReportItem> = ordering(byString)
  .on(item => item.organization.name);

const SchoolYearOrdering: Ordering<AggregateReportItem> = ordering(byNumber).on(item => item.schoolYear);

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

  /**
   * True if performance aggregate values should be displayed as percentages of total
   * students tested.  False to display absolute counts.
   */
  @Input()
  public valueDisplayType: string;

  /**
   * True if performance levels should be grouped based upon the performance level rollup.
   */
  @Input()
  public performanceLevelDisplayType: string;


  @Input()
  public preview: boolean = false;

  @ViewChild("datatable")
  private resultsTable: DataTable;

  public treeColumns: number[] = [];
  public performanceLevelTranslationPrefix: string;
  public loading: boolean = true;

  private _previousSortEvent: any;
  private _table: any;
  private _columnOrdering: string[];
  private _districtNamesById: Map<number, string> = new Map();
  private _orderingByColumnField: { [key: string]: Ordering<AggregateReportItem> } = {};

  constructor(public colorService: ColorService) {
  }

  ngOnInit(): void {

    this.performanceLevelTranslationPrefix = `common.assessment-type.${this.table.assessmentDefinition.typeCode}.performance-level.`;

    // Give the datatable a chance to initialize, run this next frame
    Utils.setImmediate(() => {
      this.resultsTable.cols.changes.subscribe(() => {
        this.renderWithPreviousRowSorting();
      });
      this.columnOrdering && this.updateColumnOrder();
      this.table && this.render();
      this.loading = false;
    });
  }

  /**
   * The report data.
   */
  @Input()
  set table(value: AggregateReportTable) {
    if (this._table !== value) {
      const table = {
        rows: value.rows ? value.rows.concat() : [],
        assessmentDefinition: value.assessmentDefinition,
        options: value.options
      };

      // TODO outsource this common logic
      const options = table.options;

      const assessmentGradeOrdering = ordering(ranking(options.assessmentGrades))
        .on((item: AggregateReportItem) => item.assessmentGradeCode);

      const dimensionOptionsByDimensionType = {
        Gender: options.genders,
        Ethnicity: options.ethnicities,
        LEP: options.limitedEnglishProficiencies,
        MigrantStatus: options.migrantStatuses,
        Section504: options.migrantStatuses,
        IEP: options.individualEducationPlans,
        EconomicDisadvantage: options.economicDisadvantages,
        StudentEnrolledGrade: options.assessmentGrades
      };

      const dimensionTypeAndCodeRanking = table.options.dimensionTypes.reduce((ranking, dimensionType) => {
        return ranking.concat(
          (dimensionOptionsByDimensionType[ dimensionType ] || []).map(dimensionCode => `${dimensionType}.${dimensionCode}`)
        );
      }, []);

      const dimensionOrdering = ordering(ranking(
        [OverallDimensionType, ...dimensionTypeAndCodeRanking]
      )).on((item: AggregateReportItem) => `${item.dimension.type}.${item.dimension.code}`);

      this._districtNamesById = this.getDistrictNamesById(value.rows);
      this._orderingByColumnField['organization.name'] = this.createOrganizationOrdering();
      this._orderingByColumnField['assessmentGradeCode'] = assessmentGradeOrdering;
      this._orderingByColumnField['schoolYear'] = SchoolYearOrdering;
      this._orderingByColumnField['dimension.id'] = dimensionOrdering;
      this._table = table;

      if (!this.loading) {
        this.render();
      }
    }
  }

  get table(): AggregateReportTable {
    return this._table;
  }

  /**
   * The tree column ordering as an array of field strings.
   * e.g. ['organization', 'assessmentGrade', 'schoolYear', 'dimension']
   */
  @Input()
  set columnOrdering(value: string[]) {
    this._columnOrdering = value ? value.concat() : [];
    if (!this.loading) {
      this.updateColumnOrder();
      this.render();
    }
  }

  get columnOrdering(): string[] {
    return this._columnOrdering;
  }

  get performanceLevels(): number[] {
    return this.performanceLevelDisplayType === 'Separate'
      ? this.table.assessmentDefinition.performanceLevels
      : [
        this.table.assessmentDefinition.performanceLevelGroupingCutPoint - 1,
        this.table.assessmentDefinition.performanceLevelGroupingCutPoint
      ];
  }

  getPerformanceLevelColumnHeaderTranslationCode(level: number): string {
    return this.performanceLevelDisplayType === 'Separate'
      ? this.performanceLevelTranslationPrefix + String(level) + '.short-name'
      : 'aggregate-reports.results.cols.grouped-performance-level-prefix.' + String(level - 2)
  }

  get rowSortingEnabled(): boolean | string {
    return this.preview ? false : 'custom';
  }

  get paginationEnabled(): boolean {
    return !this.preview;
  }

  private render(): void {
    this.sort();
  }

  private renderWithPreviousRowSorting(): void {
    this.sort(this._previousSortEvent);
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
    const ordering: Comparator<AggregateReportItem>[] = this.getColumnOrdering();
    if (event && (
        !this._previousSortEvent ||
        event.order != 1 ||
        event.field != this._previousSortEvent.field
      )
    ) {
      // Standard column sort.  Sort on the selected column first, then default sorting.
      ordering.unshift(this.getComparator(event.field, event.order));
      this._previousSortEvent = event;
    } else {
      //This is the third time sorting on the same column, reset to default sorting
      this._previousSortEvent = null;
      this.resultsTable.reset();
    }

    //Sort the data based upon the ordered list of Comparators
    this._table.rows = this.table.rows.sort(join(...ordering));
    this.calculateTreeColumns();
    this.resultsTable.value = this.table.rows;
  }

  /**
   * Retrieve the current display index of the given column.
   *
   * @param {Column} column A PrimeNG Column instance
   * @returns {number}  The current display index of the column
   */
  public getColumnIndex(column: Column): number {
    return this.resultsTable.columns.indexOf(column);
  }

  /**
   * Modify the PrimeNG DataTable to display tree columns in the order specified by
   * {@link #columnOrdering}
   */
  private updateColumnOrder(): void {
    // Assumes the ordered columns always start from the first column and extend to some terminal column
    const comparator = ordering(ranking(this.columnOrdering)).on((column: Column) => column.colId).compare;
    const orderedColumns: Column[] = this.resultsTable.columns.slice(0, this.columnOrdering.length).sort(comparator);
    this.resultsTable.columns.splice(0, this.columnOrdering.length, ...orderedColumns);
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
    let rowOrdering: Ordering<AggregateReportItem> = this._orderingByColumnField[ field ];
    if (!rowOrdering) {
      rowOrdering = ordering(byNumber).on(item => _.get(item, field, 0));
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
      .map((column: Column) => {
        const ordering = this._orderingByColumnField[ column.field ];
        return ordering ? ordering.compare : null;
      })
      .filter(value => !Utils.isNullOrUndefined(value));
  }

  /**
   * Calculate the index for each row at which it differs from the data in the previous row.
   * This is used to display a tree-like structure which hides repetitive data in the left-most columns.
   */
  private calculateTreeColumns(): void {
    const treeColumns = [];
    const pageSize: number = this.resultsTable.rows;
    let previousItem: AggregateReportItem;
    this.table.rows.forEach((currentItem: AggregateReportItem, index: number) => {
      treeColumns.push(!previousItem || (index % pageSize == 0)
        ? 0 : this.indexOfFirstUniqueColumnValue(previousItem, currentItem)
      );
      previousItem = currentItem;
    });
    this.treeColumns = treeColumns;
  }

  /**
   * Gets the index of the first column of a row holding a value that the previous row did not
   * This only traverses the leading re-orderable columns.
   *
   * @param previewItem
   * @param currentItem
   * @returns {number}
   */
  private indexOfFirstUniqueColumnValue(previousItem: any, currentItem: any): number {
    let index: number;
    for (index = 0; index < this.columnOrdering.length - 1; index++) {
      let column: Column = this.resultsTable.columns[ index ];
      let previousValue = _.get(previousItem, column.field); // TODO would be nice if this was based on "sortField" as opposed to field
      let currentValue = _.get(currentItem, column.field);
      if (previousValue != currentValue) {
        break;
      } else {
      }
    }
    return index;
  }

  private getDistrictNamesById(items: AggregateReportItem[]): Map<number, string> {
    const districtNamesById = new Map<number, string>();
    items.forEach(item => {
      if (item.organization.type === OrganizationType.District) {
        const district = item.organization as District;
        districtNamesById.set(district.id, district.name);
      }
    });
    return districtNamesById;
  }

  private createOrganizationOrdering(): Ordering<AggregateReportItem> {

    const districtsWithSchoolsByName: Ordering<AggregateReportItem> = ordering(byString)
      .on(item => {
        switch (item.organization.type) {
          case OrganizationType.District:
            return this._districtNamesById.get((item.organization as District).id) || '';
          case OrganizationType.School:
            return this._districtNamesById.get((item.organization as School).districtId) || '';
          default:
            return '';
        }
      });

    return ordering(join(
      StateOrdering.compare,
      districtsWithSchoolsByName.compare,
      DistrictsWithSchoolsByIdOrdering.compare,
      DistrictOrdering.compare,
      SchoolOrdering.compare
    ));
  }

}

export interface AggregateReportTable {
  readonly rows: AggregateReportItem[];
  readonly assessmentDefinition: AssessmentDefinition;
  readonly options: AggregateReportOptions;
}

