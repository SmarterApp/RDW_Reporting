import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Exam, ExamInterface } from '../../../model/exam.model';
import { StudentReportDownloadComponent } from '../../../../report/student-report-download.component';
import { ReportOptions } from '../../../../report/report-options.model';
import { TranslateService } from '@ngx-translate/core';
import { MenuActionBuilder } from '../../../menu/menu-action.builder';
import { Assessment } from '../../../model/assessment.model';
import { InstructionalResourcesService } from '../../instructional-resources.service';
import { PopupMenuAction } from '../../../../shared/menu/popup-menu-action.model';
import { TargetScoreExam } from '../../../model/target-score-exam.model';
import { AggregateTargetScoreRow, TargetReportingLevel } from '../../../model/aggregate-target-score-row.model';
import { AggregateReportItem } from '../../../../aggregate-report/results/aggregate-report-item';
import { ExamFilterService } from '../../../filters/exam-filters/exam-filter.service';
import { FilterBy } from '../../../model/filter-by.model';

// TODO replace this stub

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

  @Input()
  filterBy: FilterBy;

  @ViewChild('menuReportDownloader')
  reportDownloader: StudentReportDownloadComponent;

  columns: Column[];
  loading: boolean = false;
  targetScoreExams: TargetScoreExam[];

  constructor(private examFilterService: ExamFilterService,
              private actionBuilder: MenuActionBuilder,
              private translate: TranslateService,
              private instructionalResourcesService: InstructionalResourcesService) {
  }

  ngOnInit() {
    this.loading = true;

    this.columns = [
      new Column({ id: 'claim', headerInfo: true }),
      new Column({ id: 'target', headerInfo: true }),
      new Column({ id: 'subgroup', headerInfo: true }),
      new Column({ id: 'students-tested' }),
      new Column({ id: 'student-relative-residual-scores-level', headerInfo: true }),
      new Column({ id: 'standard-met-relative-residual-level', headerInfo: true })
    ];

    // forkJoin calls to get targets by assessment and examWithTargetScores

    // backfill the excluded targets
  }

  // TODO: need to fill out the AggregateTargetScoreRow to include more data
  backfillExcludedTargets(allTargets: any[], targetScoreRows: AggregateTargetScoreRow[]): AggregateTargetScoreRow[] {
    let filledTargetScoreRows: AggregateTargetScoreRow[] = targetScoreRows.concat();

    allTargets.forEach(target => {
      if (!filledTargetScoreRows.some(x => x.targetId == target.targetId)) {
        filledTargetScoreRows.push(<AggregateTargetScoreRow>{
          targetId: target.targetId,
          standardMetRelativeLevel: TargetReportingLevel.Excluded,
          studentRelativeLevel: TargetReportingLevel.Excluded
        })
      }
    });

    return [];

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
    return `common.subject.${this.assessment.subject}.claim.${row.claimCode}.name`;
  }

  getClaimCodeTranslation(row: AggregateTargetScoreRow): string {
    return this.translate.instant(this.getClaimCodeTranslationKey(row));
  }

  getTargetDisplay(row: AggregateTargetScoreRow): string {
    return "Fetch target display from API here";
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
