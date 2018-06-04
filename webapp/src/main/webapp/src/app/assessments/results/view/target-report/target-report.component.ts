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
import { join } from '@kourge/ordering/comparator';
import { TargetService } from '../../../../shared/target/target.service';
import { AssessmentExamMapper } from '../../../assessment-exam.mapper';
import { BaseColumn } from '../../../../shared/datatable/base-column.model';
import { Table } from 'primeng/table';
import { DataTableService } from '../../../../shared/datatable/datatable-service';
import { ExamFilterOptionsService } from '../../../filters/exam-filters/exam-filter-options.service';
import { ExamFilterOptions } from '../../../model/exam-filter-options.model';
import { TargetStatisticsCalculator } from '../../target-statistics-calculator';
import { Subgroup } from '../../../../aggregate-report/subgroup/subgroup';
import { SubjectClaimOrderings } from '../../../../shared/ordering/orderings';
import { ApplicationSettingsService } from '../../../../app-settings.service';

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

  /**
   * The overall number of students tested
   */
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
      this.updateTargetScoreExamFilters();

      this._filterBySubscription = this._filterBy.onChanges.subscribe(() => {
        this.updateTargetScoreExamFilters();
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
  subgroupOptions: ExamFilterOptions = new ExamFilterOptions();
  showSubgroupOptions: boolean = false;
  minimumStudentCount: number = 0;

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
              private filterOptionService: ExamFilterOptionsService,
              private applicationSettingsService: ApplicationSettingsService) {
  }

  ngOnInit() {
    if (!this.showResults) return;

    this.loading = true;

    this.columns = [
      new Column({ id: 'claim', sortField: 'claimOrder' }),
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
      this.applicationSettingsService.getSettings()
    ).subscribe(([ allTargets, targetScoreExams, subgroupOptions, applicationSettings ]) => {
      this.targetScoreExams = targetScoreExams;
      this.subgroupOptions = subgroupOptions;
      this.allTargets = allTargets;

      this.minimumStudentCount = applicationSettings.targetReport.minimumStudentCount;
      this.targetStatisticsCalculator.insufficientDataCutoff = applicationSettings.targetReport.insufficientDataCutoff;

      this.targetDisplayMap = allTargets.reduce((targetMap, target) => {
        targetMap[target.id] = {
          name: this.assessmentExamMapper.formatTarget(target.code),
          description: target.description,
          claim: target.claimCode
        };

        return targetMap;
      }, new Map<number, any>());


      this.aggregateTargetScoreRows = this.targetStatisticsCalculator.aggregateOverallScores(
        this.assessment.subject,
        allTargets,
        this.targetScoreExams);

      this.sortRows();
      this.calculateTreeColumns();

      this.loading = false;
    });
  }

  get showResults(): boolean {
    return this.studentsTested > this.minimumStudentCount;
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
        SubjectClaimOrderings.get(this.assessment.subject).on<AggregateTargetScoreRow>(row => row.claim).compare,
        ordering(byTarget).on<AggregateTargetScoreRow>(row => row.target).compare,
        ordering(bySubgroup).on<AggregateTargetScoreRow>(row => row.subgroup).compare
      )
    );
  }

  toggleSubgroup(subgroup) {
    subgroup.selected = !subgroup.selected;

    if (subgroup.selected) {
      this.addSubgroup(subgroup.code);
    }
    else {
      this.removeSubgroup(subgroup.code);
    }
  }

  toggleSubgroupOptions() {
    this.showSubgroupOptions = !this.showSubgroupOptions;
  }

  addSubgroup(subgroupCode: string) {
    this.aggregateTargetScoreRows.push(
      ...this.targetStatisticsCalculator.aggregateSubgroupScores(this.assessment.subject, this.allTargets, this.targetScoreExams, [subgroupCode], this.subgroupOptions)
    );

    this.updateTargetScoreTable();
  }

  removeSubgroup(subgroupCode: string) {
    this.aggregateTargetScoreRows = this.aggregateTargetScoreRows.filter(x => x.subgroup.dimensionGroups[0].type != subgroupCode);
    this.calculateTreeColumns();
  }

  private updateTargetScoreTable(): void {
    this.sortRows();
    this.calculateTreeColumns();
  }

  private updateTargetScoreExamFilters() {
    // TODO: handle filters
    this.filterExams();
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
  sortField: string;
  headerInfo: boolean;

  constructor({
                id,
                field = '',
                sortField = '',
                headerInfo = false,
              }) {
    this.id = id;
    this.field = field ? field : id;
    this.sortField = sortField ? sortField : this.field;
    this.headerInfo = headerInfo;
  }
}
