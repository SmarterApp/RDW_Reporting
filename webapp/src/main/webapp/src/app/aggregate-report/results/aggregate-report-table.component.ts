import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Ordering, ordering } from '@kourge/ordering';
import { AggregateReportItem } from './aggregate-report-item';
import { byNumber, byString, Comparator, join, ranking } from '@kourge/ordering/comparator';
import { ColorService } from '../../shared/color.service';
import { AssessmentDefinition } from '../assessment/assessment-definition';
import { OrganizationType } from '../../shared/organization/organization';
import { Utils } from '../../shared/support/support';
import { AggregateReportOptions } from '../aggregate-report-options';
import { PerformanceLevelDisplayTypes } from '../../shared/display-options/performance-level-display-type';
import { ValueDisplayTypes } from '../../shared/display-options/value-display-type';
import { AggregateReportTableExportService, ExportOptions } from './aggregate-report-table-export.service';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import * as _ from 'lodash';
import { organizationOrdering, subgroupOrdering } from '../support';
import { TranslateService } from '@ngx-translate/core';
import { BaseColumn } from '../../shared/datatable/base-column.model';
import { byNumericString, ClaimReportElaClaimOrder, SubjectClaimOrderings } from '../../shared/ordering/orderings';
import { IdentityColumnOptions } from '../assessment/assessment-definition.service';
import { AggregateReportType } from '../aggregate-report-form-settings';
import { byTargetReportingLevel } from '../../assessments/model/aggregate-target-score-row.model';

export const SupportedRowCount = 10000;
export const DefaultRowsPerPageOptions = [ 100, 500, 1000 ];

const SchoolYearOrdering: Ordering<AggregateReportItem> = ordering(byNumber)
  .on(item => item.schoolYear);

const AssessmentLabelOrdering: Ordering<AggregateReportItem> = ordering(byString)
  .on(item => item.assessmentLabel);

const OrganizationalClaimOrderingProvider: (subjectCode: string, preview: boolean) => Ordering<AggregateReportItem> = (subjectCode, preview) => {
  const currentOrdering: Ordering<string> = !preview && SubjectClaimOrderings.has(subjectCode)
    ? SubjectClaimOrderings.get(subjectCode)
    : ordering(byString);
  return currentOrdering.on(item => item.claimCode);
};

const TargetOrdering: Ordering<AggregateReportItem> = ordering(byNumericString)
  .on(item => item.targetCode || item.targetNaturalId);

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
  host: {
    '[class.disabled-table]': 'preview'
  }
})
export class AggregateReportTableComponent implements OnInit {

  @Input()
  public preview: boolean = false;

  @Input()
  public rowsPerPageOptions: number[] = DefaultRowsPerPageOptions;

  @ViewChild('dataTable')
  private dataTable: Table;

  public treeColumns: number[] = [];
  public columns: Column[];

  private _previousSortEvent: any;
  private _orderingByColumnField: { [ key: string ]: Ordering<AggregateReportItem> } = {};

  private _initialTable: AggregateReportTable;
  private _table: AggregateReportTable;

  private _initialIdentityColumns: string[] = IdentityColumnOptions.concat();
  private _identityColumns: string[];

  private _initialValueDisplayType: string = ValueDisplayTypes.Percent;
  private _valueDisplayType: string;

  private _initialPerformanceLevelDisplayType: string = PerformanceLevelDisplayTypes.Separate;
  private _performanceLevelDisplayType: string;

  private _initialized: boolean = false;

  constructor(public colorService: ColorService,
              private translate: TranslateService,
              private exportService: AggregateReportTableExportService) {
  }

  ngOnInit(): void {
    if (this._initialTable == null) {
      throw new Error('AggregateReportTableComponent.table must be set');
    }
    this._table = this.parseTable(this._initialTable);
    this._identityColumns = this._initialIdentityColumns.concat();
    this._valueDisplayType = this._initialValueDisplayType;
    this._performanceLevelDisplayType = this._initialPerformanceLevelDisplayType;
    this.buildAndRender(this._table);
    this._initialized = true;
  }

  get valueDisplayType(): string {
    return this._valueDisplayType;
  }

  @Input()
  set valueDisplayType(value: string) {
    if (!this._initialized) {
      this._initialValueDisplayType = value;
      return;
    }
    this._valueDisplayType = ValueDisplayTypes.valueOf(value);
    this.updatePerformanceLevelColumns();
  }

  get performanceLevelDisplayType(): string {
    return this._performanceLevelDisplayType;
  }

  get cutPoint(): number {
    return this.table.assessmentDefinition.performanceLevelGroupingCutPoint;
  }

  get assessmentTypeCode(): string {
    return this.table.assessmentDefinition.typeCode;
  }

  get center(): boolean {
    return this.table.assessmentDefinition.performanceLevelGroupingCutPoint != null;
  }

  @Input()
  set performanceLevelDisplayType(value: string) {
    if (!this._initialized) {
      this._initialPerformanceLevelDisplayType = value;
      return;
    }
    this._performanceLevelDisplayType = PerformanceLevelDisplayTypes.valueOf(value);
    this.updatePerformanceLevelColumns();
  }

  /**
   * The report data.
   */
  @Input()
  set table(value: AggregateReportTable) {
    if (!this._initialized) {
      this._initialTable = value;
      return;
    }
    if (this._table !== value) {
      this._table = this.parseTable(value);
      this.buildAndRender(this._table);
    }
  }

  private parseTable(value: AggregateReportTable): AggregateReportTable {
    return {
      rows: value.rows ? value.rows.concat() : [],
      assessmentDefinition: value.assessmentDefinition,
      options: value.options,
      reportType: value.reportType || AggregateReportType.GeneralPopulation
    };
  }

  get table(): AggregateReportTable {
    return this._table;
  }

  /**
   * The tree column ordering as an array of field strings.
   * e.g. ['organization', 'assessmentGrade', 'schoolYear', 'dimension']
   */
  @Input()
  set identityColumns(value: string[]) {
    if (!this._initialized) {
      this._initialIdentityColumns = value;
      return;
    }
    const previousColumns = this._identityColumns;
    const newColumns = value ? value.concat() : [];

    this._identityColumns = newColumns;

    // did the columns present change?
    if (_.isEqual(previousColumns.concat().sort(), newColumns.concat().sort())) {
      // did the order of the columns present change?
      if (!_.isEqual(previousColumns, newColumns)) {
        this.updateColumnOrder();
        this.sortRows();
      }
    } else {
      // rebuild the table with the new identity columns
      this.buildAndRender(this.table);
    }
  }

  get identityColumns(): string[] {
    return this._identityColumns;
  }

  get rowSortingEnabled(): boolean | string {
    return this.preview ? false : 'custom';
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
  public sort(event?: SortEvent): void {
    const ordering: Comparator<AggregateReportItem>[] = this.getIdentityColumnsComparator();

    if (!event.field) {
      // We're not sorting on a field.  Just apply the default column ordering
      event.data.sort(join(...ordering));
      this.calculateTreeColumns();
      return;
    }

    if (!this._previousSortEvent ||
      event === this._previousSortEvent ||
      event.order !== 1 ||
      event.field !== this._previousSortEvent.field) {
      // Standard column sort.  Sort on the selected column first, then default sorting.
      ordering.unshift(this.getComparator(event.field, event.order));
      this._previousSortEvent = event;
    } else {
      // This is the third time sorting on the same column, reset to default sorting
      delete this._previousSortEvent;
      this.dataTable.reset();
    }

    // Sort the data based upon the ordered list of Comparators
    event.data.sort(join(...ordering));
    this.calculateTreeColumns();
  }

  public readField(item: AggregateReportItem, field: string) {
    return _.get(item, field, '');
  }

  public toDash(str: string): string {
    return Utils.camelCaseToDash(str);
  }

  /**
   * Export the current table contents in the currently-displayed format as a csv.
   */
  public exportTable(name: string): void {
    const options: ExportOptions = {
      valueDisplayType: this.valueDisplayType,
      performanceLevelDisplayType: this.performanceLevelDisplayType,
      columnOrdering: this.identityColumns,
      assessmentDefinition: this.table.assessmentDefinition,
      reportType: this.table.reportType,
      name: name
    };

    this.exportService.exportTable(this.table.rows, options);
  }

  public getOrganizationTypeColor(type: OrganizationType): string {
    let i = 0;
    for (const value in OrganizationType) {
      if (value === type) {
        return this.colorService.getColor(i);
      }
      i++;
    }
    return this.colorService.getColor(0);
  }

  private getClaimCodeTranslationKey(row: AggregateReportItem): string {
    return this.table.reportType === AggregateReportType.Target
      ? `common.claim-name.${row.claimCode}`
      : `common.subject.${row.subjectCode}.claim.${row.claimCode}.name`;
  }

  getClaimCodeTranslation(row: AggregateReportItem): string {
    return this.translate.instant(this.getClaimCodeTranslationKey(row));
  }

  getTargetDisplay(row: AggregateReportItem): { name: string, description: string } {
    const targetName: string = row.targetCode
      ? row.targetCode
      : this.translate.instant('common.unknown') + ' (' + row.targetNaturalId + ')';

    return {
      name: targetName,
      description: row.targetDescription || ''
    };
  }

  private buildAndRender({ rows, options, assessmentDefinition, reportType }: AggregateReportTable): void {

    // configure row sorting
    const assessmentGradeOrdering = ordering(ranking(options.assessmentGrades))
      .on((item: AggregateReportItem) => item.assessmentGradeCode);

    this._orderingByColumnField[ 'assessmentLabel' ] = AssessmentLabelOrdering;
    this._orderingByColumnField[ 'organization.name' ] = organizationOrdering(item => item.organization, rows);
    this._orderingByColumnField[ 'assessmentGradeCode' ] = assessmentGradeOrdering;
    this._orderingByColumnField[ 'schoolYear' ] = SchoolYearOrdering;
    this._orderingByColumnField[ 'claimCode' ] = reportType === AggregateReportType.Target
      ? OrganizationalClaimOrderingProvider(rows[ 0 ].subjectCode, this.preview)
      : ordering(
        join(
          ranking(options.claims.filter(claim => claim.subject !== 'ELA').map(claim => claim.code)),
          ClaimReportElaClaimOrder.compare
        )
      ).on<AggregateReportItem>(item => item.claimCode);
    this._orderingByColumnField[ 'subgroup.id' ] = subgroupOrdering(item => item.subgroup, options);
    this._orderingByColumnField[ 'targetNaturalId' ] = TargetOrdering;
    this._orderingByColumnField[ 'studentRelativeResidualScoresLevel' ] = ordering(byTargetReportingLevel)
      .on(item => item.studentRelativeResidualScoresLevel);
    this._orderingByColumnField[ 'standardMetRelativeResidualLevel' ] = ordering(byTargetReportingLevel)
      .on(item => item.standardMetRelativeResidualLevel);

    // Create columns

    const IdentityColumns: Column[] = [
      new Column({ id: 'organization', field: 'organization.name' }),
      new Column({ id: 'assessmentGrade', field: 'assessmentGradeCode' }),
      new Column({ id: 'assessmentLabel' }),
      new Column({ id: 'schoolYear' }),
      new Column({ id: 'claim', field: 'claimCode' }),
      new Column({ id: 'dimension', field: 'subgroup.id' }),
      new Column({ id: 'target', field: 'targetNaturalId' })
    ];

    const performanceLevelsByDisplayType = {
      Separate: assessmentDefinition.performanceLevels,
      Grouped: [
        assessmentDefinition.performanceLevelGroupingCutPoint - 1,
        assessmentDefinition.performanceLevelGroupingCutPoint
      ]
    };

    const dataColumns: Column[] = [];
    switch (reportType) {
      case AggregateReportType.GeneralPopulation:
      case AggregateReportType.LongitudinalCohort:
        dataColumns.push(
          new Column({ id: 'studentsTested' }),
          new Column({ id: 'achievementComparison', sortable: false }),
          new Column({ id: 'avgScaleScore' }),
          ...this.createPerformanceLevelColumns(performanceLevelsByDisplayType, assessmentDefinition)
        );
        break;
      case AggregateReportType.Claim:
        dataColumns.push(
          new Column({ id: 'studentsTested' }),
          new Column({ id: 'achievementComparison', sortable: false }),
          ...this.createPerformanceLevelColumns(performanceLevelsByDisplayType, assessmentDefinition)
        );
        break;
      case AggregateReportType.Target:
        dataColumns.push(
          new Column({ id: 'studentsTested' }),
          new Column({ id: 'studentRelativeResidualScoresLevel' }),
          new Column({ id: 'standardMetRelativeResidualLevel' })
        );
        break;
    }

    this.columns = [
      ...this.identityColumns
        .map(columnId => IdentityColumns.find(column => column.id === columnId)),
      ...dataColumns
    ];

    this.calculateTreeColumns();
    this.sortRows();
  }

  /**
   * Sort rows of the table
   */
  private sortRows(): void {
    // Latest TurboTable version (1.5.7) does not sort when row data
    // changes.  Manually trigger a sort after setting row data.
    this.sort({ data: this._table.rows });
    // reset any sort indicators
    this.dataTable.reset();
  }

  private renderWithPreviousRowSorting(): void {
    if (!this._previousSortEvent) {
      // re-apply default sorting
      this.dataTable.sortSingle();
    } else {
      // re-apply the last sort
      this.sort(this._previousSortEvent);
    }
  }

  /**
   * Modify the PrimeNG Table to display tree columns in the order specified by
   * {@link #identityColumns}
   */
  private updateColumnOrder(): void {
    if (!this.columns) {
      return;
    }

    // Assumes the ordered columns always start from the first column and extend to some terminal column
    const comparator = ordering(ranking(this.identityColumns)).on((column: Column) => column.id).compare;
    const orderedColumns: Column[] = this.columns.slice(0, this.identityColumns.length).sort(comparator);

    this.columns.splice(0, this.identityColumns.length, ...orderedColumns);
    this.renderWithPreviousRowSorting();
  }

  /**
   * Given a column field, return a Comparator used to sort on the given field.
   * NOTE: This assumes any non-tree column is a *number* value.  If we add a non-tree non-number
   * column, this will need some additional Comparator complexity.
   * NOTE: Rows with 0 students tested should always be sorted at the bottom, regardless
   * of whether the user is sorting in ascending or descending order.
   *
   * @param {string} field  A data field/property
   * @param {number} order  The sort order (1 for asc, -1 for desc)
   * @returns {Comparator<AggregateReportItem>} A Comparator for ordering results by the given field
   */
  private getComparator(field: string, order: number): Comparator<AggregateReportItem> {
    const ascending: boolean = order >= 0;
    let rowOrdering: Ordering<AggregateReportItem> = (this._orderingByColumnField[ field ])
      ? this._orderingByColumnField[ field ]
      : ordering(byNumber).on(item => _.get(item, field));
    if (!ascending) {
      rowOrdering = rowOrdering.reverse();
    }
    return this.getNoResultsLastComparator(rowOrdering.compare, order);
  }

  private getNoResultsLastComparator(comparator: Comparator<any>, order: number): Comparator<AggregateReportItem> {
    const ascending: boolean = order >= 0;
    const noResultsComparator: Ordering<AggregateReportItem> = ordering(byNumber)
      .on(item => item.studentsTested === 0 ? 1 : 0);
    return join(
      (ascending ? noResultsComparator.compare : noResultsComparator.compare),
      comparator
    );
  }

  /**
   * Get the ordered list of Comparators that result in a tree-like display.
   * The order of Comparators depends upon the column order.
   *
   * @returns {Comparator<AggregateReportItem>[]} The ordered list of comparators
   */
  private getIdentityColumnsComparator(): Comparator<AggregateReportItem>[] {
    return this.columns
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
    const pageSize: number = this.dataTable.rows;
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
   * Gets the index of the first column of a row holding a value that does not
   * match the previous row's value.
   * This only traverses the leading re-orderable columns.
   *
   * @param previousItem  The previous row model
   * @param currentItem   The current row
   * @returns {number}  The differentiating column of the currentItem
   */
  private indexOfFirstUniqueColumnValue(previousItem: AggregateReportItem, currentItem: AggregateReportItem): number {
    let index: number;
    for (index = 0; index < this.identityColumns.length - 1; index++) {
      const column: Column = this.columns[ index ];
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

  private createPerformanceLevelColumns(performanceLevelsByDisplayType: any, assessmentDefinition: AssessmentDefinition): Column[] {
    const performanceColumns: Column[] = [];
    Object.keys(performanceLevelsByDisplayType)
      .forEach(displayType => {
        performanceLevelsByDisplayType[ displayType ].forEach((level, index) => {
          performanceColumns.push(new Column({
            id: 'performanceLevel',
            displayType: displayType,
            level: level,
            visible: this.performanceLevelDisplayType === displayType,
            index: index,
            field: `performanceLevelByDisplayTypes.${displayType}.${this.valueDisplayType}.${index}`,
            headerKey: this.getPerformanceLevelColumnHeaderTranslationCode(displayType, level, index),
            headerColor: this.colorService.getPerformanceLevelColorsByNumberOfPerformanceLevels(assessmentDefinition.performanceLevelCount, level)
          }));
        });
      });

    return performanceColumns;
  }

  private updatePerformanceLevelColumns() {
    (this.columns || [])
      .filter(column => column.id === 'performanceLevel')
      .forEach((column: Column) => {
        column.visible = column.displayType === this.performanceLevelDisplayType;
        column.field = `performanceLevelByDisplayTypes.${column.displayType}.${this.valueDisplayType}.${column.index}`;
        column.headerKey = this.getPerformanceLevelColumnHeaderTranslationCode(column.displayType, column.level, column.index);
      });
  }

  private getPerformanceLevelColumnHeaderTranslationCode(displayType: string, level: number, index: number) {
    return displayType === 'Separate'
      ? `common.assessment-type.${this.table.reportType === AggregateReportType.Claim ? 'iab' : this.table.assessmentDefinition.typeCode}.performance-level.${level}.name-prefix`
      : `aggregate-report-table.columns.grouped-performance-level-prefix.${index}`;
  }

}

export interface AggregateReportTable {
  readonly rows: AggregateReportItem[];
  readonly assessmentDefinition: AssessmentDefinition;
  readonly options: AggregateReportOptions;
  readonly reportType: AggregateReportType;
}

class Column implements BaseColumn {
  // The column id/type
  id: string;

  // The sort/display field for a row item (defaults to id)
  field: string;

  // True if the column is sortable (default true)
  sortable: boolean;

  // True if the column is displayed (default true)
  visible: boolean;

  // The following properties are only used by performance level columns
  displayType?: string;
  level?: number;
  index?: number;
  headerKey?: string;
  headerColor?: string;

  constructor({
                id,
                field = '',
                sortable = true,
                visible = true,
                displayType = '',
                level = -1,
                index = -1,
                headerKey = '',
                headerColor = ''
              }) {
    this.id = id;
    this.field = field ? field : id;
    this.sortable = sortable;
    this.visible = visible;

    if (displayType) {
      this.displayType = displayType;
    }

    if (level >= 0) {
      this.level = level;
    }

    if (index >= 0) {
      this.index = index;
    }

    if (headerKey) {
      this.headerKey = headerKey;
    }

    if (headerColor) {
      this.headerColor = headerColor;
    }
  }
}
