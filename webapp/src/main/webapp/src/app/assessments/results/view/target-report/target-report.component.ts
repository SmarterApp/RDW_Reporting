import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { StudentReportDownloadComponent } from '../../../../report/student-report-download.component';
import { TranslateService } from '@ngx-translate/core';
import { MenuActionBuilder } from '../../../menu/menu-action.builder';
import { Assessment } from '../../../model/assessment.model';
import { TargetScoreExam } from '../../../model/target-score-exam.model';
import { AggregateTargetScoreRow, TargetReportingLevel } from '../../../model/aggregate-target-score-row.model';
import { ExamFilterService } from '../../../filters/exam-filters/exam-filter.service';
import { FilterBy } from '../../../model/filter-by.model';
import { GroupAssessmentService } from '../../../../groups/results/group-assessment.service';
import { Subscription } from 'rxjs/Subscription';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Target } from '../../../model/target.model';
import { ordering } from '@kourge/ordering';
import { byString, join, ranking } from '@kourge/ordering/comparator';
import { TargetService } from '../../../../shared/target/target.service';
import { AssessmentExamMapper } from '../../../assessment-exam.mapper';
import { BaseColumn } from '../../../../shared/datatable/base-column.model';
import { Table } from 'primeng/table';
import { DataTableService } from '../../../../shared/datatable/datatable-service';
import { SubgroupMapper } from '../../../../aggregate-report/subgroup/subgroup.mapper';
import { ExamFilterOptionsService } from '../../../filters/exam-filters/exam-filter-options.service';
import { ExamFilterOptions } from '../../../model/exam-filter-options.model';
import { TargetStatisticsCalculator } from '../../target-statistics-calculator';
import { Subgroup } from '../../../../aggregate-report/subgroup/subgroup';
import { AggregateReportOptionsService } from '../../../../aggregate-report/aggregate-report-options.service';

@Component({
  selector: 'target-report',
  templateUrl: './target-report.component.html'
})
export class TargetReportComponent implements OnInit {
  /**
   * The assessment
   */
  @Input()
  assessment: Assessment;

  // TODO: check what this is called in the config
  /**
   * The minimum number of students that must be included in order to show any results
   */
  @Input()
  minimumStudents: number = 2;

  /**
   * The number of students that must be included in order to hide the caution text
   */
  @Input()
  maximumStudentsCaution: number = 5;

  @Input()
  studentsTested: number;

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
      this.updateTargetScoreExam();

      this._filterBySubscription = this._filterBy.onChanges.subscribe(() => {
        this.updateTargetScoreExam();
      });
    }
  }

  @ViewChild('menuReportDownloader')
  reportDownloader: StudentReportDownloadComponent;

  @ViewChild('dataTable')
  private dataTable: Table;

  columns: Column[];
  allTargets: Target[] = [];
  loading: boolean = false;
  targetScoreExams: TargetScoreExam[];
  targetDisplayMap: Map<number, any>;
  aggregateTargetScoreRows: AggregateTargetScoreRow[] = [];
  identityColumns: string[] = [ 'claim', 'target', 'subgroup' ];
  treeColumns: number[] = [];
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  showSubgroupOptions: boolean = false;

  // TODO: handle ELAS, vs LEP decision
  allSubgroups: any[] = [
    {code: 'Gender', translatecode: 'gender-label', selected: false},
    {code: 'Ethnicity', translatecode: 'ethnicity-label', selected: false},
    {code: 'ELAS', translatecode: 'elas-label', selected: false},
    {code: 'Section504', translatecode: '504-label', selected: false},
    {code: 'IEP', translatecode: 'iep-label', selected: false},
    {code: 'MigrantStatus', translatecode: 'migrant-status-label', selected: false}
  ];

  private _filterBy: FilterBy;
  private _filterBySubscription: Subscription;

  constructor(private examFilterService: ExamFilterService,
              private actionBuilder: MenuActionBuilder,
              private translate: TranslateService,
              private targetStatisticsCalculator: TargetStatisticsCalculator,
              private targetService: TargetService,
              private dataTableService: DataTableService,
              private assessmentExamMapper: AssessmentExamMapper,
              private assessmentProvider: GroupAssessmentService,
              private filterOptionService: ExamFilterOptionsService) {
  }

  ngOnInit() {
    if (!this.showResults) return;

    this.loading = true;

    this.columns = [
      new Column({ id: 'claim' }),
      new Column({ id: 'target' }),
      new Column({ id: 'subgroup' }),
      new Column({ id: 'studentsTested' }),
      new Column({ id: 'student-relative-residual-scores-level', headerInfo: true }),
      new Column({ id: 'standard-met-relative-residual-level', headerInfo: true })
    ];

    forkJoin(
      this.targetService.getTargetsForAssessment(this.assessment.id),
      this.assessmentProvider.getTargetScoreExams(this.assessment.id),
      this.filterOptionService.getExamFilterOptions(),

    ).subscribe(([ allTargets, targetScoreExams, filterOptions ]) => {
      this.targetScoreExams = targetScoreExams;
      this.filterOptions = filterOptions;
      this.allTargets = allTargets;

      this.targetDisplayMap = allTargets.reduce((targetMap, target) => {
        targetMap[target.id] = {
          name: this.assessmentExamMapper.formatTarget(target.code),
          description: target.description,
          claim: target.claimCode
        };

        return targetMap;
      }, new Map<number, any>());

      this.updateTargetScoreExam();

      this.loading = false;
    });
  }

  get showResults(): boolean {
    return this.studentsTested > this.minimumStudents;
  }

  get showCautionMessage(): boolean {
    return this.showResults && this.studentsTested < this.maximumStudentsCaution;
  }

  calculateTreeColumns() {
    if (this.dataTable == null) return;

    this.treeColumns = this.dataTableService.calculateTreeColumns(
      this.aggregateTargetScoreRows,
      this.dataTable,
      this.columns,
      this.identityColumns
    );
  }

  sortRows() {
    const byTarget = (a: string, b: string) => {
      let numA = Number(a);
      let numB = Number(b);

      if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB;

      return a.localeCompare(b);
    };

    const bySubgroup = (a: Subgroup, b: Subgroup) => {
      // Overall should be first
      if (a.name.startsWith('Overall') && !b.name.startsWith('Overall')) return -1;
      if (!a.name.startsWith('Overall') && b.name.startsWith('Overall')) return 1;

      return a.name.localeCompare(b.name);
    };

    this.aggregateTargetScoreRows.sort(
      join(
        ordering(byString).on<AggregateTargetScoreRow>(row => row.claim).compare,
        ordering(byTarget).on<AggregateTargetScoreRow>(row => row.target).compare,
        ordering(bySubgroup).on<AggregateTargetScoreRow>(row => row.subgroup).compare
      )
    );
  }

  toggleSubgroup(subgroup) {
    subgroup.selected = !subgroup.selected;
    this.updateTargetScoreExam();
  }

  toggleSubgroupOptions() {
    this.showSubgroupOptions = !this.showSubgroupOptions;
  }

  private updateTargetScoreExam(): void {
    let rows = this.targetStatisticsCalculator.aggregateTargetScores(this.targetScoreExams, this.filterOptions, this.selectedSubgroups);
    this.aggregateTargetScoreRows = this.targetStatisticsCalculator.mergeTargetData(this.allTargets, rows, this.targetDisplayMap);

    this.sortRows();
    this.calculateTreeColumns();
  }

  get selectedSubgroups(): string[] {
    return this.allSubgroups.filter(x => x.selected).map(x => x.code);
  }

  private filterExams(): TargetScoreExam[] {
    const exams: TargetScoreExam[] = <TargetScoreExam[]>this.examFilterService
      .filterExams(this.targetScoreExams, this.assessment, this.filterBy);

    // only filter by sessions if this is my groups, otherwise return all regardless of session
    // if (this.allowFilterBySessions) {
    //   return exams.filter(x => this.sessions.some(y => y.filter && y.id === x.session));
    // }

    return exams;
  }

  private getClaimCodeTranslationKey(row: AggregateTargetScoreRow): string {
    return `common.claim-name.${row.claim}`;
  }

  getClaimCodeTranslation(row: AggregateTargetScoreRow): string {
    return this.translate.instant(this.getClaimCodeTranslationKey(row));
  }

  getTargetDisplay(row: AggregateTargetScoreRow): any {
    return this.targetDisplayMap[row.targetId];
  }

  getTargetReportingLevelString(level: TargetReportingLevel): string {
    return TargetReportingLevel[level];
  }
}

class Column implements BaseColumn {
  id: string;
  field: string;
  headerInfo: boolean;

  constructor({
                id,
                field = '',
                headerInfo = false,
              }) {
    this.id = id;
    this.field = field ? field : id;
    this.headerInfo = headerInfo;
  }
}
