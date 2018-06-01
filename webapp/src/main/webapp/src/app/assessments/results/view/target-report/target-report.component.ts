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
import { ExamStatisticsCalculator } from '../../exam-statistics-calculator';
import { ordering } from '@kourge/ordering';
import { byString, join } from '@kourge/ordering/comparator';
import { TargetService } from '../../../../shared/target/target.service';
import { AssessmentExamMapper } from '../../../assessment-exam.mapper';

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

  columns: Column[];
  loading: boolean = false;
  targetScoreExams: TargetScoreExam[];
  targetDisplayMap: Map<number, any>;
  aggregateTargetScoreRows: AggregateTargetScoreRow[] = [];

  private _filterBy: FilterBy;
  private _filterBySubscription: Subscription;

  constructor(private examFilterService: ExamFilterService,
              private actionBuilder: MenuActionBuilder,
              private translate: TranslateService,
              private examStatisticsCalculator: ExamStatisticsCalculator,
              private targetService: TargetService,
              private assessmentExamMapper: AssessmentExamMapper,
              private assessmentProvider: GroupAssessmentService) {
  }

  ngOnInit() {
    this.loading = true;

    this.columns = [
      new Column({ id: 'claim' }),
      new Column({ id: 'target' }),
      new Column({ id: 'subgroup' }),
      new Column({ id: 'students-tested' }),
      new Column({ id: 'student-relative-residual-scores-level', headerInfo: true }),
      new Column({ id: 'standard-met-relative-residual-level', headerInfo: true })
    ];

    forkJoin(
      this.targetService.getTargetsForAssessment(this.assessment.id),
      this.assessmentProvider.getTargetScoreExams(this.assessment.id)
    ).subscribe(([ allTargets, targetScoreExams ]) => {
      this.targetScoreExams = targetScoreExams;

      this.aggregateTargetScoreRows = this.mergeTargetData(
        allTargets,
        this.examStatisticsCalculator.aggregateTargetScores(this.targetScoreExams)
      );

      this.targetDisplayMap = allTargets.reduce((targetMap, target) => {
        targetMap[target.id] = {
          name: this.assessmentExamMapper.formatTarget(target.code),
          description: target.description
        };

        return targetMap;
      }, new Map<number, any>());

      this.loading = false;
    });
  }

  // TODO: do we need to use the includeInReport flag?  what if that flag is true but we don't have scores
  mergeTargetData(allTargets: Target[], targetScoreRows: AggregateTargetScoreRow[]): AggregateTargetScoreRow[] {
    let filledTargetScoreRows: AggregateTargetScoreRow[] = targetScoreRows.concat();

    allTargets.forEach(target => {
      let index = filledTargetScoreRows.findIndex(x => x.targetId == target.id)
      if (index === -1) {
        filledTargetScoreRows.push(<AggregateTargetScoreRow>{
          targetId: target.id,
          targetNaturalId: target.naturalId,
          claimCode: target.claimCode,
          standardMetRelativeLevel: TargetReportingLevel.Excluded,
          studentRelativeLevel: TargetReportingLevel.Excluded
        })
      } else {
        filledTargetScoreRows[ index ].claimCode = target.claimCode;
        filledTargetScoreRows[ index ].targetNaturalId = target.naturalId;
      }
    });

    return filledTargetScoreRows
      .sort(
        join(
          ordering(byString).on<AggregateTargetScoreRow>(row => row.claimCode).compare,
          ordering(byString).on<AggregateTargetScoreRow>(row => row.targetNaturalId).compare
        )
      );
  }

  private updateTargetScoreExam(): void {
    this.targetScoreExams = this.filterExams();
    this.aggregateTargetScoreRows = this.examStatisticsCalculator.aggregateTargetScores(this.targetScoreExams);
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
    return `common.claim-name.${row.claimCode}`;
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

class Column {
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
