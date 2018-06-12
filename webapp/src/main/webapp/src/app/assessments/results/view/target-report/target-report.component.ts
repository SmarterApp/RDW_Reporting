import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { StudentReportDownloadComponent } from '../../../../report/student-report-download.component';
import { TranslateService } from '@ngx-translate/core';
import { MenuActionBuilder } from '../../../menu/menu-action.builder';
import { Assessment } from '../../../model/assessment.model';
import { TargetScoreExam } from '../../../model/target-score-exam.model';
import {
  AggregateTargetScoreRow,
  byTargetReportingLevel,
  TargetReportingLevel
} from '../../../model/aggregate-target-score-row.model';
import { ExamFilterService } from '../../../filters/exam-filters/exam-filter.service';
import { FilterBy } from '../../../model/filter-by.model';
import { GroupAssessmentService } from '../../../../groups/results/group-assessment.service';
import { Subscription } from 'rxjs/Subscription';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Target } from '../../../model/target.model';
import { Ordering, ordering } from '@kourge/ordering';
import { byNumber, byString, Comparator, join } from '@kourge/ordering/comparator';
import { TargetService } from '../../../../shared/target/target.service';
import { AssessmentExamMapper } from '../../../assessment-exam.mapper';
import { BaseColumn } from '../../../../shared/datatable/base-column.model';
import { Table } from 'primeng/table';
import { DataTableService } from '../../../../shared/datatable/datatable-service';
import { ExamFilterOptionsService } from '../../../filters/exam-filters/exam-filter-options.service';
import { ExamFilterOptions } from '../../../model/exam-filter-options.model';
import { TargetStatisticsCalculator } from '../../target-statistics-calculator';
import { Subgroup } from '../../../../aggregate-report/subgroup/subgroup';
import { AssessmentProvider } from '../../../assessment-provider.interface';
import { byNumericString, SubjectClaimOrderings } from '../../../../shared/ordering/orderings';
import { ApplicationSettingsService } from '../../../../app-settings.service';
import { ExportResults } from '../../assessment-results.component';
import { ExportTargetReportRequest } from '../../../model/export-target-report-request.model';
import { AssessmentExporter } from '../../../assessment-exporter.interface';
import { ExamStatistics } from '../../../model/exam-statistics.model';
import { Exam } from '../../../model/exam.model';
import { SortEvent } from 'primeng/api';
import { AggregateReportItem } from '../../../../aggregate-report/results/aggregate-report-item';
import { Utils } from '../../../../shared/support/support';

const SubgroupOrdering = ordering((a: Subgroup, b: Subgroup) => {
  // Overall should be first
  if (a.name.startsWith('Overall') && !b.name.startsWith('Overall')) {
    return -1;
  }
  if (!a.name.startsWith('Overall') && b.name.startsWith('Overall')) {
    return 1;
  }
  return a.name.localeCompare(b.name);
});

@Component({
  selector: 'target-report',
  templateUrl: './target-report.component.html'
})
export class TargetReportComponent implements OnInit, ExportResults {

  @Input()
  assessmentProvider: AssessmentProvider;

  /**
   * The assessment
   */
  @Input()
  assessment: Assessment;

  /**
   * The overall number of students tested
   */
  @Input()
  studentsTested: number;

  @Input()
  statistics: ExamStatistics;

  @Input()
  displayedFor: string;

  @Input()
  set exams(exams: Exam[]) {
    if (exams && exams.length > 0) {
      this.schoolYear = exams[ 0 ].schoolYear;
    }
  }

  schoolYear: number;

  @Input()
  set sessions(value: any) {
    this._sessions = value;
    this.updateTargetScoreExamFilters();
  }

  /**
   * Exam filters applied, if any.
   */
  @Input()
  set filterBy(value: FilterBy) {
    this._filterBy = value;

    if (this._filterBySubscription) {
      this._filterBySubscription.unsubscribe();
    }

    if (this._filterBy) {
      this.updateTargetScoreExamFilters();

      this._filterBySubscription = this._filterBy.onChanges.subscribe(() => {
        this.updateTargetScoreExamFilters();
      });
    }
  }

  /**
   * Service class which provides export capabilities for this assessment and exam.
   */
  @Input()
  assessmentExporter: AssessmentExporter;

  @ViewChild('menuReportDownloader')
  reportDownloader: StudentReportDownloadComponent;

  @ViewChild('dataTable')
  private dataTable: Table;

  columns: Column[] = [
    new Column({ id: 'claim' }),
    new Column({ id: 'target' }),
    new Column({ id: 'subgroup' }),
    new Column({ id: 'studentsTested' }),
    new Column({ id: 'student-relative-residual-scores-level', headerInfo: true }),
    new Column({ id: 'standard-met-relative-residual-level', headerInfo: true })
  ];

  allTargets: Target[] = [];
  loading: boolean = false;
  targetDisplayMap: Map<number, any>;
  aggregateTargetScoreRows: AggregateTargetScoreRow[] = [];
  identityColumns: string[] = [ 'claim', 'target', 'subgroup' ];
  treeColumns: number[] = [];
  subgroupOptions: ExamFilterOptions = new ExamFilterOptions();
  showSubgroupOptions: boolean = false;
  minimumStudentCount: number = 0;

  // holds the original values that includes all the data
  originalTargetScoreExams: TargetScoreExam[];

  // the filtered values used to get the aggregate rows for the data table
  targetScoreExams: TargetScoreExam[];

  allSubgroups: any[] = [];

  private _sessions: any[];
  private _filterBy: FilterBy;
  private _filterBySubscription: Subscription;
  private _orderingByIdentityField: { [ key: string ]: Ordering<AggregateTargetScoreRow> } = {};
  private _previousSortEvent: SortEvent;

  constructor(private examFilterService: ExamFilterService,
              private actionBuilder: MenuActionBuilder,
              private translate: TranslateService,
              private targetStatisticsCalculator: TargetStatisticsCalculator,
              private targetService: TargetService,
              private dataTableService: DataTableService,
              private assessmentExamMapper: AssessmentExamMapper,
              private filterOptionService: ExamFilterOptionsService,
              private assessmentService: GroupAssessmentService,
              private applicationSettingsService: ApplicationSettingsService) {

    applicationSettingsService.getSettings().subscribe(settings => {
      this.allSubgroups = this.createAllSubgroups(settings);
    });
  }

  ngOnInit(): void {
    if (!this.showResults) {
      return;
    }

    this.loading = true;

    this.identityColumns.forEach(column => {
      this._orderingByIdentityField[ column ] = this.createOrdering(column);
    });

    forkJoin(
      this.targetService.getTargetsForAssessment(this.assessment.id),
      this.assessmentProvider.getTargetScoreExams(this.assessment.id),
      this.filterOptionService.getExamFilterOptions(),
      this.applicationSettingsService.getSettings()
    ).subscribe(([ allTargets, targetScoreExams, subgroupOptions, applicationSettings ]) => {
      this.originalTargetScoreExams = this.targetScoreExams = targetScoreExams;
      this.subgroupOptions = subgroupOptions;
      this.allTargets = allTargets;

      this.minimumStudentCount = applicationSettings.targetReport.minimumStudentCount;
      this.targetStatisticsCalculator.insufficientDataCutoff = applicationSettings.targetReport.insufficientDataCutoff;

      this.targetDisplayMap = allTargets.reduce((targetMap, target) => {
        targetMap.set(target.id, {
          name: this.assessmentExamMapper.formatTarget(target.code),
          description: target.description,
          claim: target.claimCode
        });

        return targetMap;
      }, new Map<number, any>());

      this.aggregateTargetScoreRows = this.targetStatisticsCalculator.aggregateOverallScores(
        this.assessment.subject,
        allTargets,
        this.targetScoreExams);

      this.updateTargetScoreExamFilters();

      this.loading = false;
    });
  }

  hasDataToExport(): boolean {
    return this.aggregateTargetScoreRows && this.aggregateTargetScoreRows.length !== 0;
  }

  /**
   * Sort the data
   *
   * @param event {{order: number, field: string}} An optional sort event
   */
  public sort(event?: SortEvent): void {
    if (!event.data || !event.data.length) {
      return;
    }

    const ordering: Comparator<AggregateTargetScoreRow>[] = this.getIdentityColumnsComparator();

    if (event.field) {
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
    }

    event.data.sort(join(...ordering));
    this.calculateTreeColumns();
  }

  private getComparator(field, order): Comparator<AggregateTargetScoreRow> {
    const ascending = order > 0;
    const columnOrdering = this.createOrdering(field);
    return ascending ? columnOrdering.compare : columnOrdering.reverse().compare;
  }

  /**
   * Get the ordered list of Comparators that result in a tree-like display.
   * The order of Comparators depends upon the column order.
   *
   * @returns {Comparator<AggregateReportItem>[]} The ordered list of comparators
   */
  private getIdentityColumnsComparator(): Comparator<AggregateTargetScoreRow>[] {
    return this.columns
      .map((column: Column) => {
        const ordering = this._orderingByIdentityField[ column.field ];
        return ordering ? ordering.compare : null;
      })
      .filter(value => !Utils.isNullOrUndefined(value));
  }

  private createOrdering(field: string): Ordering<AggregateTargetScoreRow> {
    switch (field) {
      case 'claim':
        const claimOrdering: Ordering<string> = (SubjectClaimOrderings.get(this.assessment.subject) || ordering(byString));
        return claimOrdering.on<AggregateTargetScoreRow>(row => row.claim);
      case 'target':
        return ordering(byNumericString).on<AggregateTargetScoreRow>(row => this.targetDisplayMap.get(row.targetId).name);
      case 'subgroup':
        return SubgroupOrdering.on<AggregateTargetScoreRow>(row => row.subgroup);
      case 'studentsTested':
        return ordering(byNumber).on<AggregateTargetScoreRow>(row => row.studentsTested);
      case 'student-relative-residual-scores-level':
        return ordering(byTargetReportingLevel).on<AggregateTargetScoreRow>(row => row.studentRelativeLevel);
      case 'standard-met-relative-residual-level':
        return ordering(byTargetReportingLevel).on<AggregateTargetScoreRow>(row => row.standardMetRelativeLevel);
      default:
        throw Error(field + ' not accounted for in sorting');
    }
  }


  exportToCsv(): void {
    const exportRequest = new ExportTargetReportRequest();
    exportRequest.assessment = this.assessment;
    exportRequest.targetScoreRows = this.aggregateTargetScoreRows;
    exportRequest.group = this.displayedFor;
    exportRequest.schoolYear = this.schoolYear;
    exportRequest.averageScaleScore = Math.round(this.statistics.average);
    exportRequest.standardError = Math.round(this.statistics.standardError);

    this.assessmentExporter.exportTargetScoresToCsv(exportRequest);
  }

  get showResults(): boolean {
    return this.studentsTested > this.minimumStudentCount;
  }

  calculateTreeColumns() {
    if (this.dataTable == null) {
      return;
    }

    this.treeColumns = this.dataTableService.calculateTreeColumns(
      this.aggregateTargetScoreRows,
      this.dataTable,
      this.columns,
      this.identityColumns
    );
  }

  toggleSubgroup(subgroup) {
    subgroup.selected = !subgroup.selected;

    if (subgroup.selected) {
      this.addSubgroup(subgroup.code);
    } else {
      this.removeSubgroup(subgroup.code);
    }
  }

  toggleSubgroupOptions() {
    this.showSubgroupOptions = !this.showSubgroupOptions;
  }

  addSubgroup(subgroupCode: string) {
    this.aggregateTargetScoreRows.push(
      ...this.targetStatisticsCalculator.aggregateSubgroupScores(this.assessment.subject, this.allTargets, this.targetScoreExams, [ subgroupCode ], this.subgroupOptions)
    );

    this.updateTargetScoreTable();
  }

  removeSubgroup(subgroupCode: string) {
    this.aggregateTargetScoreRows = this.aggregateTargetScoreRows.filter(x => x.subgroup.dimensionGroups[ 0 ].type != subgroupCode);
    this.calculateTreeColumns();
  }

  private recalculateAggregateRows(): void {
    // do overall
    this.aggregateTargetScoreRows = this.targetStatisticsCalculator.aggregateOverallScores(
      this.assessment.subject,
      this.allTargets,
      this.targetScoreExams);

    // add selected subgroups
    const subgroupCodes = this.allSubgroups.filter(x => x.selected).map(x => x.code);

    this.aggregateTargetScoreRows.push(
      ...this.targetStatisticsCalculator.aggregateSubgroupScores(this.assessment.subject, this.allTargets, this.targetScoreExams, subgroupCodes, this.subgroupOptions)
    );
  }

  private updateTargetScoreTable(): void {
    this.sort({data: this.aggregateTargetScoreRows});
  }

  private updateTargetScoreExamFilters() {
    this.targetScoreExams = this.filterExams();
    this.recalculateAggregateRows();
    this.updateTargetScoreTable();
  }

  private filterExams(): TargetScoreExam[] {
    if (this.originalTargetScoreExams == null) {
      return [];
    }

    const exams: TargetScoreExam[] = <TargetScoreExam[]>this.examFilterService
      .filterExams(this.originalTargetScoreExams, this.assessment, this._filterBy);

    // this is only for Groups so always filter by sessions
    return exams.filter(x => this._sessions.some(y => y.filter && y.id === x.session));
  }

  private createAllSubgroups(settings: any): any[] {
    const subgroups = [
      { code: 'Gender', translatecode: 'gender-label', selected: false },
      { code: 'Ethnicity', translatecode: 'ethnicity-label', selected: false }
    ];
    if (settings.elasEnabled) {
      subgroups.push({ code: 'ELAS', translatecode: 'elas-label', selected: false });
    }
    if (settings.lepEnabled) {
      subgroups.push({ code: 'LEP', translatecode: 'limited-english-proficiency-label', selected: false });
    }
    subgroups.push(
      { code: 'Section504', translatecode: '504-label', selected: false },
      { code: 'IEP', translatecode: 'iep-label', selected: false },
      { code: 'MigrantStatus', translatecode: 'migrant-status-label', selected: false }
    );
    return subgroups;
  }

  getClaimCodeTranslation(row: AggregateTargetScoreRow): string {
    return this.translate.instant(`common.claim-name.${row.claim}`);
  }

  getTargetDisplay(row: AggregateTargetScoreRow): any {
    return this.targetDisplayMap.get(row.targetId);
  }

  getTargetReportingLevelString(level: TargetReportingLevel): string {
    return TargetReportingLevel[ level ];
  }
}

class Column implements BaseColumn {
  id: string;
  field: string;
  headerInfo: boolean;

  constructor({
                id,
                field = '',
                headerInfo = false
              }) {
    this.id = id;
    this.field = field ? field : id;
    this.headerInfo = headerInfo;
  }
}
