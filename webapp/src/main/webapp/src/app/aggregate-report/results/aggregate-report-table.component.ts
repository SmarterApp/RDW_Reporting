import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { Ordering, ordering } from '@kourge/ordering';
import { AggregateReportItem } from './aggregate-report-item';
import {
  byNumber,
  byString,
  Comparator,
  join,
  ranking
} from '@kourge/ordering/comparator';
import { AssessmentDefinition } from '../assessment/assessment-definition';
import { OrganizationType } from '../../shared/organization/organization';
import { Utils } from '../../shared/support/support';
import { AggregateReportOptions } from '../aggregate-report-options';
import { PerformanceLevelDisplayTypes } from '../../shared/display-options/performance-level-display-type';
import { ValueDisplayTypes } from '../../shared/display-options/value-display-type';
import {
  AggregateReportTableExportService,
  ExportOptions
} from './aggregate-report-table-export.service';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { get, isEqual } from 'lodash';
import { organizationOrdering, subgroupOrdering } from '../support';
import { TranslateService } from '@ngx-translate/core';
import { BaseColumn } from '../../shared/datatable/base-column.model';
import {
  byNumericString,
  getOrganizationalClaimOrdering
} from '../../shared/ordering/orderings';
import { byTargetReportingLevel } from '../../assessments/model/aggregate-target-score-row.model';
import { SubjectDefinition } from '../../subject/subject';
import { ReportQueryType } from '../../report/report';
import { color } from '../../shared/colors';

export const SupportedRowCount = 4000;

function safeCopy<T>(array: T[]): T[] {
  return array != null ? array.slice() : [];
}

function toRow(
  row: AggregateReportItem
): AggregateReportItem & { organizationColor: string } {
  const { organization = <any>{} } = row;
  const colorIndex = Object.keys(OrganizationType).findIndex(
    value => value === organization.type
  );
  const organizationColor = color(colorIndex < 0 ? 0 : colorIndex);
  return {
    ...row,
    organizationColor
  };
}

const SchoolYearOrdering: Ordering<AggregateReportItem> = ordering(byNumber).on(
  item => item.schoolYear
);

const AssessmentLabelOrdering: Ordering<AggregateReportItem> = ordering(
  byString
).on(item => item.assessmentLabel);

const RelativeResidualScoreLevelOrdering: Ordering<
  AggregateReportItem
> = ordering(byTargetReportingLevel).on(
  item => item.studentRelativeResidualScoresLevel
);

const MetRelativeResidualScoreLevelOrdering: Ordering<
  AggregateReportItem
> = ordering(byTargetReportingLevel).on(
  item => item.standardMetRelativeResidualLevel
);

const NoResultsComparator: Ordering<AggregateReportItem> = ordering(
  byNumber
).on(item => (item.studentsTested === 0 ? 1 : 0));

const createOrganizationalClaimOrdering: (
  subjectCode: string,
  preview: boolean
) => Ordering<AggregateReportItem> = (subjectCode, preview) => {
  const currentOrdering: Ordering<string> = !preview
    ? getOrganizationalClaimOrdering(subjectCode)
    : ordering(byString);
  return currentOrdering.on(item => item.claimCode);
};

const targetOrdering = translate =>
  ordering(byNumericString).on((item: AggregateReportItem) =>
    translate.instant(
      `subject.${item.subjectCode}.claim.${item.claimCode}.target.${
        item.targetNaturalId
      }.name`
    )
  );

const assessmentGradeOrdering = grades =>
  ordering(ranking(grades)).on(
    (item: AggregateReportItem) => item.assessmentGradeCode
  );

function createOrderingByColumnField(
  options: AggregateReportOptions,
  subjectDefinition: SubjectDefinition,
  reportType: ReportQueryType,
  rows: AggregateReportItem[],
  preview: boolean,
  translate: TranslateService
): { [fieldId: string]: Ordering<AggregateReportItem> } {
  return {
    assessmentLabel: AssessmentLabelOrdering,
    'organization.name': organizationOrdering(item => item.organization, rows),
    assessmentGradeCode: assessmentGradeOrdering(options.assessmentGrades),
    schoolYear: SchoolYearOrdering,
    'subgroup.id': subgroupOrdering(item => item.subgroup, options),
    targetNaturalId: targetOrdering(translate),
    studentRelativeResidualScoresLevel: RelativeResidualScoreLevelOrdering,
    standardMetRelativeResidualLevel: MetRelativeResidualScoreLevelOrdering,
    claimCode:
      reportType === 'Target'
        ? createOrganizationalClaimOrdering(subjectDefinition.subject, preview)
        : ordering(
            ranking(
              subjectDefinition.claimScore != null
                ? subjectDefinition.claimScore.codes
                : []
            )
          ).on(row => row.claimCode),
    altScoreCode: ordering(
      ranking(
        subjectDefinition.alternateScore != null
          ? subjectDefinition.alternateScore.codes
          : []
      )
    ).on(row => row.altScoreCode)
  };
}

function createColumns(
  translate: TranslateService,
  subjectDefinition: SubjectDefinition,
  reportType: ReportQueryType,
  identityColumns: string[],
  valueDisplayType: string,
  performanceLevelDisplayType: string
): Column[] {
  const IdentityColumns: Column[] = [
    new Column({
      id: 'organization',
      field: 'organization.name',
      classes: 'wrapping'
    }),
    new Column({ id: 'assessmentGrade', field: 'assessmentGradeCode' }),
    new Column({ id: 'assessmentLabel' }),
    new Column({ id: 'schoolYear' }),
    new Column({ id: 'claim', field: 'claimCode', classes: 'wrapping' }),
    new Column({ id: 'altScore', field: 'altScoreCode', classes: 'wrapping' }),
    new Column({ id: 'dimension', field: 'subgroup.id', classes: 'wrapping' }),
    new Column({ id: 'target', field: 'targetNaturalId', classes: 'wrapping' })
  ];

  const dataColumns: Column[] = [];
  switch (reportType) {
    case 'CustomAggregate':
    case 'Longitudinal':
      dataColumns.push(
        new Column({ id: 'studentsTested' }),
        new Column({
          id: 'achievementComparison',
          sortable: false,
          classes: 'wrapping'
        }),
        new Column({ id: 'avgScaleScore', valueColumn: true }),
        ...createPerformanceLevelColumns(
          translate,
          subjectDefinition,
          reportType,
          valueDisplayType,
          performanceLevelDisplayType
        )
      );
      break;
    case 'Claim':
      dataColumns.push(
        new Column({ id: 'studentsTested' }),
        new Column({
          id: 'achievementComparison',
          sortable: false,
          classes: 'wrapping'
        }),
        ...createPerformanceLevelColumns(
          translate,
          subjectDefinition,
          reportType,
          valueDisplayType,
          performanceLevelDisplayType
        )
      );
      break;
    case 'AltScore':
      dataColumns.push(
        new Column({ id: 'studentsTested' }),
        new Column({
          id: 'achievementComparison',
          sortable: false,
          classes: 'wrapping'
        }),
        new Column({ id: 'avgScaleScore', valueColumn: true }),
        ...createPerformanceLevelColumns(
          translate,
          subjectDefinition,
          reportType,
          valueDisplayType,
          performanceLevelDisplayType
        )
      );
      break;
    case 'Target':
      dataColumns.push(
        new Column({ id: 'studentsTested' }),
        new Column({
          id: 'studentRelativeResidualScoresLevel',
          valueColumn: true
        }),
        new Column({
          id: 'standardMetRelativeResidualLevel',
          valueColumn: true
        })
      );
      break;
  }

  return [
    ...identityColumns.map(columnId =>
      IdentityColumns.find(column => column.id === columnId)
    ),
    ...dataColumns
  ];
}

function levelsByReportType(
  reportType: ReportQueryType,
  subjectDefinition: SubjectDefinition
): number[] {
  let levels: number[] = null;

  switch (reportType) {
    case 'Claim':
      if (subjectDefinition.claimScore != null) {
        levels = subjectDefinition.claimScore.levels;
      }
      break;
    case 'AltScore':
      if (subjectDefinition.alternateScore != null) {
        levels = subjectDefinition.alternateScore.levels;
      }
      break;
    default:
      levels = subjectDefinition.overallScore.levels;
      break;
  }

  return levels || [];
}

function createPerformanceLevelColumns(
  translate: TranslateService,
  subjectDefinition: SubjectDefinition,
  reportType: ReportQueryType,
  valueDisplayType: string,
  performanceLevelDisplayType: string
): Column[] {
  const performanceLevelsByDisplayType = {
    Separate: levelsByReportType(reportType, subjectDefinition),
    Grouped: [
      subjectDefinition.overallScore.standardCutoff - 1,
      subjectDefinition.overallScore.standardCutoff
    ]
  };

  const performanceColumns: Column[] = [];
  Object.keys(performanceLevelsByDisplayType).forEach(displayType => {
    performanceLevelsByDisplayType[displayType].forEach((level, index) => {
      const columnOptions = {
        id: 'performanceLevel',
        displayType: displayType,
        level: level,
        index: index,
        valueColumn: true
      };
      performanceColumns.push(
        new Column({
          ...columnOptions,
          ...createPerformanceLevelColumnDynamicFields(
            translate,
            subjectDefinition,
            reportType,
            columnOptions,
            performanceLevelDisplayType,
            valueDisplayType
          )
        })
      );
    });
  });

  return performanceColumns;
}

function createPerformanceLevelColumnDynamicFields(
  translate: TranslateService,
  subjectDefinition: SubjectDefinition,
  reportType: ReportQueryType,
  column: Column | { displayType: string; level: number; index: number },
  performanceLevelDisplayType: string,
  valueDisplayType: string
) {
  return {
    visible: column.displayType === performanceLevelDisplayType,
    field: `performanceLevelByDisplayTypes.${
      column.displayType
    }.${valueDisplayType}.${column.index}`,
    headerText: getPerformanceLevelColumnHeaderText(
      translate,
      subjectDefinition,
      reportType,
      column.displayType,
      column.level,
      column.index
    ),
    headerSuffix: getPerformanceLevelColumnHeaderSuffix(
      translate,
      subjectDefinition,
      reportType,
      column.displayType,
      column.level
    ),
    headerColor: getPerformanceLevelColors(
      translate,
      subjectDefinition,
      reportType,
      column.level
    )
  };
}

function getModifier(reportType) {
  // Used to get proper key for translating level colors, headings, and suffixes.
  switch (reportType) {
    case 'Claim':
      return 'claim-score.';
    case 'AltScore':
      return 'alt-score.';
    default:
      return '';
  }
}

function getPerformanceLevelColumnHeaderText(
  translate: TranslateService,
  subjectDefinition: SubjectDefinition,
  reportType: ReportQueryType,
  displayType: string,
  level: number,
  index: number
): string {
  return translate.instant(
    displayType === 'Separate'
      ? `subject.${subjectDefinition.subject}.asmt-type.${
          subjectDefinition.assessmentType
        }.${getModifier(reportType)}level.${level}.short-name`
      : `aggregate-report-table.columns.grouped-performance-level-prefix.${index}`
  );
}

function getPerformanceLevelColumnHeaderSuffix(
  translate: TranslateService,
  subjectDefinition: SubjectDefinition,
  reportType: ReportQueryType,
  displayType: string,
  level: number
): string {
  return displayType === 'Separate'
    ? translate.instant(
        `subject.${subjectDefinition.subject}.asmt-type.${
          subjectDefinition.assessmentType
        }.${getModifier(reportType)}level.${level}.suffix`
      )
    : '';
}

function getPerformanceLevelColors(
  translate: TranslateService,
  subjectDefinition: SubjectDefinition,
  reportType: ReportQueryType,
  level: number
): string {
  return translate.instant(
    `subject.${subjectDefinition.subject}.asmt-type.${
      subjectDefinition.assessmentType
    }.${getModifier(reportType)}level.${level}.color`
  );
}

/**
 * Get the ordered list of Comparators that result in a tree-like display.
 * The order of Comparators depends upon the column order.
 *
 * @returns {Comparator<AggregateReportItem>[]} The ordered list of comparators
 */
function identityColumnComparators(
  columns: Column[],
  orderingByColumnField: { [key: string]: Ordering<AggregateReportItem> }
): Comparator<AggregateReportItem>[] {
  return columns
    .map((column: Column) => {
      const ordering = orderingByColumnField[column.field];
      return ordering ? ordering.compare : null;
    })
    .filter(value => value != null);
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
function getComparator(
  columns: Column[],
  orderingByColumnField: { [field: string]: Ordering<AggregateReportItem> },
  field: string,
  order: number
): Comparator<AggregateReportItem> {
  const ascending: boolean = order >= 0;
  let rowOrdering: Ordering<AggregateReportItem> = orderingByColumnField[field]
    ? orderingByColumnField[field]
    : ordering(byNumber).on(item => get(item, field));
  if (!ascending) {
    rowOrdering = rowOrdering.reverse();
  }
  return columns.find(column => column.field === field).valueColumn
    ? join(NoResultsComparator.compare, rowOrdering.compare)
    : rowOrdering.compare;
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
function indexOfFirstUniqueColumnValue(
  columns: Column[],
  identityColumns: string[],
  previousItem: AggregateReportItem,
  currentItem: AggregateReportItem
): number {
  let index: number;
  for (index = 0; index < identityColumns.length - 1; index++) {
    const column: Column = columns[index];
    if (column.id === 'organization') {
      const previousOrg = previousItem.organization;
      const currentOrg = currentItem.organization;
      if (!previousOrg.equals(currentOrg)) {
        break;
      }
    } else {
      const previousValue = get(previousItem, column.field); // TODO would be nice if this was based on "sortField" as opposed to field
      const currentValue = get(currentItem, column.field);
      if (previousValue !== currentValue) {
        break;
      }
    }
  }
  return index;
}

/**
 * Calculate the index for each row at which it differs from the data in the previous row.
 * This is used to display a tree-like structure which hides repetitive data in the left-most columns.
 */
function createTreeColumns(
  columns: Column[],
  identityColumns: string[],
  rows: AggregateReportItem[]
): number[] {
  const treeColumns = [];
  // no longer using paging
  //const pageSize: number = this.dataTable.rows;
  let previousItem: AggregateReportItem;
  rows.forEach((currentItem: AggregateReportItem, index: number) => {
    treeColumns.push(
      !previousItem // || (index % pageSize == 0)
        ? 0
        : indexOfFirstUniqueColumnValue(
            columns,
            identityColumns,
            previousItem,
            currentItem
          )
    );
    previousItem = currentItem;
  });
  return treeColumns;
}

function sortColumns(columns: Column[], identityColumns: string[]): Column[] {
  // Assumes the ordered columns always start from the first column and extend the length of identity columns
  const comparator = ordering(ranking(identityColumns)).on(
    (column: Column) => column.id
  ).compare;
  return [
    ...columns.slice(0, identityColumns.length).sort(comparator),
    ...columns.slice(identityColumns.length)
  ];
}

/** @deprecated **/
export interface AggregateReportTable {
  readonly rows: AggregateReportItem[];
  readonly assessmentDefinition: AssessmentDefinition;
  readonly options: AggregateReportOptions;
  readonly reportType: ReportQueryType;
}

class Column implements BaseColumn {
  /** @deprecated use {@link #id} and change translation keys **/
  translationId: string;

  // The column id/type
  id: string;

  // The sort/display field for a row item (defaults to id)
  field: string;

  // True if the column is sortable (default true)
  sortable: boolean;

  // True if the column is displayed (default true)
  visible: boolean;

  // True if the column represents a data value that has no meaning when there are no results
  // (Example: displays as '-' when there are no results)
  valueColumn: boolean;

  // values to pass to column ngClass
  classes: any;

  // The following properties are only used by performance level columns
  displayType?: string;
  level?: number;
  index?: number;
  headerText?: string;
  headerSuffix?: string;
  headerColor?: string;

  constructor({
    id,
    field = '',
    sortable = true,
    visible = true,
    displayType = '',
    level = -1,
    index = -1,
    headerText = '',
    headerSuffix = '',
    headerColor = '',
    valueColumn = false,
    classes = undefined
  }) {
    this.translationId = Utils.camelCaseToDash(id);

    this.id = id;
    this.field = field ? field : id;
    this.sortable = sortable;
    this.visible = visible;
    this.valueColumn = valueColumn;
    this.classes = classes;

    if (displayType) {
      this.displayType = displayType;
    }

    if (level >= 0) {
      this.level = level;
    }

    if (index >= 0) {
      this.index = index;
    }

    if (headerText) {
      this.headerText = headerText;
    }

    if (headerSuffix) {
      this.headerSuffix = headerSuffix;
    }

    if (headerColor) {
      this.headerColor = headerColor;
    }
  }
}

const RowBuffer = 50;

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
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AggregateReportTableComponent implements OnInit {
  // these properties cannot be updated after initialization
  @Input()
  public preview: boolean = false;

  @Input()
  public options: AggregateReportOptions;

  @ViewChild('dataTable')
  private dataTable: Table;

  private _previousSortEvent: any;
  private _orderingByColumnField: {
    [key: string]: Ordering<AggregateReportItem>;
  } = {};
  private _identityColumnComparators: Comparator<AggregateReportItem>[];

  // internals directly exposed for rendering performance enhancement
  _initialized: boolean = false;
  _subjectDefinition: SubjectDefinition;
  _reportType: ReportQueryType;
  _rows: AggregateReportItem[] = [];
  _virtualRows: AggregateReportItem[] = [];
  _identityColumns: string[];
  _valueDisplayType: string;
  _performanceLevelDisplayType: string;

  // computed
  treeColumns: number[] = [];
  columns: Column[];
  sortMode: boolean | string;
  center: boolean;

  constructor(
    private translate: TranslateService,
    private exportService: AggregateReportTableExportService
  ) {}

  ngOnInit(): void {
    this.sortMode = this.preview ? false : 'single';
    this.center =
      !(this.claimReport || this.altScoreReport) &&
      this.subjectDefinition.performanceLevelStandardCutoff != null;
    this.buildAndRender();
    this._initialized = true;
  }

  get subjectDefinition(): SubjectDefinition {
    return this._subjectDefinition;
  }

  get claimReport(): boolean {
    return this.reportType && this.reportType === 'Claim';
  }

  get altScoreReport(): boolean {
    return this.reportType && this.reportType === 'AltScore';
  }

  @Input()
  set subjectDefinition(value: SubjectDefinition) {
    const previousValue = this._subjectDefinition;
    this._subjectDefinition = value;
    if (this._initialized && previousValue !== value) {
      this.center =
        !(this.claimReport || this.altScoreReport) &&
        this.subjectDefinition.performanceLevelStandardCutoff != null;
      this.buildAndRender();
    }
  }

  get reportType(): ReportQueryType {
    return this._reportType;
  }

  @Input()
  set reportType(value: ReportQueryType) {
    const previousValue = this._reportType;
    this._reportType = value;
    if (this._initialized && previousValue !== value) {
      this.center =
        !(this.claimReport || this.altScoreReport) &&
        this.subjectDefinition.overallScore.standardCutoff != null;
      this.buildAndRender();
    }
  }

  get rows(): AggregateReportItem[] {
    return this._rows;
  }

  @Input()
  set rows(value: AggregateReportItem[]) {
    this._rows = value.map(toRow);
    if (this._initialized) {
      this.buildAndRender();
    }
  }

  get identityColumns(): string[] {
    return this._identityColumns;
  }

  /**
   * The tree column ordering as an array of field strings.
   * e.g. ['organization', 'assessmentGrade', 'schoolYear', 'dimension']
   */
  @Input()
  set identityColumns(value: string[]) {
    const {
      _identityColumns: previousColumns,
      columns,
      rows,
      _orderingByColumnField
    } = this;

    const newColumns = safeCopy(value);
    this._identityColumns = newColumns;
    if (this._initialized && !isEqual(previousColumns, newColumns)) {
      // did just the order change?
      if (isEqual(previousColumns.slice().sort(), newColumns.slice().sort())) {
        const sortedColumns = sortColumns(columns, newColumns);
        this.columns = sortedColumns;
        this._identityColumnComparators = identityColumnComparators(
          sortedColumns,
          _orderingByColumnField
        );
        this.sortRows(rows);
      } else {
        // rebuild the table with the new identity columns
        this.buildAndRender();
      }
    }
  }

  get valueDisplayType(): string {
    return this._valueDisplayType;
  }

  @Input()
  set valueDisplayType(value: string) {
    value =
      value != null
        ? ValueDisplayTypes.valueOf(value)
        : ValueDisplayTypes.Percent;
    const previousValue = this._valueDisplayType;
    this._valueDisplayType = value;
    if (this._initialized && previousValue !== value) {
      this.updatePerformanceLevelColumns();
    }
  }

  get performanceLevelDisplayType(): string {
    return this._performanceLevelDisplayType;
  }

  @Input()
  set performanceLevelDisplayType(value: string) {
    value =
      value != null
        ? PerformanceLevelDisplayTypes.valueOf(value)
        : PerformanceLevelDisplayTypes.Separate;
    const previousValue = this._performanceLevelDisplayType;
    this._performanceLevelDisplayType = value;
    if (this._initialized && previousValue !== value) {
      this.updatePerformanceLevelColumns();
    }
  }

  // TODO find a way to avoid this as this is less performant than direct field reads
  readField(item: AggregateReportItem, field: string) {
    return get(item, field, '');
  }

  onLazyLoad(event: any): void {
    setTimeout(() => {
      const rows = this._rows.slice();

      // our method does not work with sorting.
      // this.sortRows(rows);

      this._virtualRows = rows.slice(event.first, event.first + RowBuffer);
    });
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
   * Sort the data by the event's column first, then by default column-ordered sorting.
   * Attempt to preserve as much of the tree structure as possible.
   *
   * @param event {{order: number, field: string}} An optional sort event
   */
  public sort(event?: SortEvent): void {
    const {
      columns,
      identityColumns,
      _identityColumnComparators,
      _orderingByColumnField
    } = this;

    const { data: rows, field, order } = event;
    const comparators = _identityColumnComparators.slice();
    const causedByHandler = field != null;
    if (!causedByHandler) {
      // We're not sorting on a field.  Just apply the default column ordering
      rows.sort(join(...comparators));
      this.treeColumns = createTreeColumns(columns, identityColumns, rows);
      return;
    }

    if (
      !this._previousSortEvent ||
      event === this._previousSortEvent ||
      order !== 1 ||
      field !== this._previousSortEvent.field
    ) {
      // Standard column sort.  Sort on the selected column first, then default sorting.
      const comparator = getComparator(
        columns,
        _orderingByColumnField,
        field,
        order
      );
      comparators.unshift(comparator);
      this._previousSortEvent = event;
    } else {
      // This is the third time sorting on the same column, reset to default sorting
      delete this._previousSortEvent;
      this.dataTable.reset();
    }
    // Sort the data based upon the ordered list of Comparators
    rows.sort(join(...comparators));
    this.treeColumns = createTreeColumns(columns, identityColumns, rows);
  }

  /**
   * TODO externalize
   * Export the current table contents in the currently-displayed format as a csv.
   */
  exportTable(name: string): void {
    const options: ExportOptions = {
      valueDisplayType: this.valueDisplayType,
      performanceLevelDisplayType: this.performanceLevelDisplayType,
      columnOrdering: this.identityColumns,
      subjectDefinition: this.subjectDefinition,
      reportType: this.reportType,
      name
    };

    this.exportService.exportTable(this.rows, options);
  }

  private buildAndRender(): void {
    const {
      options,
      preview,
      translate,
      rows,
      subjectDefinition,
      reportType,
      identityColumns,
      valueDisplayType,
      performanceLevelDisplayType
    } = this;

    const orderingByColumnField = createOrderingByColumnField(
      options,
      subjectDefinition,
      reportType,
      rows,
      preview,
      translate
    );

    const columns = createColumns(
      translate,
      subjectDefinition,
      reportType,
      identityColumns,
      valueDisplayType,
      performanceLevelDisplayType
    );

    // sort() depends on this
    const comparators = identityColumnComparators(
      columns,
      orderingByColumnField
    );

    this.columns = columns;
    this._orderingByColumnField = orderingByColumnField;
    this._identityColumnComparators = comparators;

    this.sortRows(rows);

    this._virtualRows = rows.slice(0, RowBuffer);
  }

  /**
   * Sort rows of the table
   */
  private sortRows(rows: AggregateReportItem[]): void {
    // Latest TurboTable version (1.5.7) does not sort when row data
    // changes.  Manually trigger a sort after setting row data.
    this.sort({ data: rows });
    // reset any sort indicators
    this.dataTable.reset();
  }

  private updatePerformanceLevelColumns() {
    const {
      columns,
      subjectDefinition,
      reportType,
      valueDisplayType,
      performanceLevelDisplayType,
      translate
    } = this;

    (columns || [])
      .filter(column => column.id === 'performanceLevel')
      .forEach(column => {
        Object.assign(
          column,
          createPerformanceLevelColumnDynamicFields(
            translate,
            subjectDefinition,
            reportType,
            column,
            performanceLevelDisplayType,
            valueDisplayType
          )
        );
      });
  }
}
