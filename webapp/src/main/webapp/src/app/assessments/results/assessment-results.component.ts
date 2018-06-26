import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AssessmentExam } from '../model/assessment-exam.model';
import { Exam } from '../model/exam.model';
import { ExamStatisticsCalculator } from './exam-statistics-calculator';
import { FilterBy } from '../model/filter-by.model';
import { Subscription } from 'rxjs/Subscription';
import { ExamFilterService } from '../filters/exam-filters/exam-filter.service';
import { ordering } from '@kourge/ordering';
import { byString } from '@kourge/ordering/comparator';
import { GradeCode } from '../../shared/enum/grade-code.enum';
import { ColorService } from '../../shared/color.service';
import { MenuActionBuilder } from '../menu/menu-action.builder';
import { ExamStatistics } from '../model/exam-statistics.model';
import { StudentReportDownloadComponent } from '../../report/student-report-download.component';
import { AssessmentProvider } from '../assessment-provider.interface';
import { ResultsByItemComponent } from './view/results-by-item/results-by-item.component';
import { DistractorAnalysisComponent } from './view/distractor-analysis/distractor-analysis.component';
import { InstructionalResourcesService } from './instructional-resources.service';
import { InstructionalResource } from '../model/instructional-resources.model';
import { Assessment } from '../model/assessment.model';
import { Observable } from 'rxjs/Observable';
import { WritingTraitScoresComponent } from './view/writing-trait-scores/writing-trait-scores.component';
import { AssessmentExporter } from '../assessment-exporter.interface';
import { AssessmentPercentileRequest, AssessmentPercentileService } from '../percentile/assessment-percentile.service';
import { PercentileGroup } from '../percentile/assessment-percentile';
import { Utils } from '../../shared/support/support';
import { ApplicationSettingsService } from '../../app-settings.service';
import { Angulartics2 } from 'angulartics2';
import { TargetReportComponent } from './view/target-report/target-report.component';
import { createScorableClaimOrdering } from '../../shared/ordering/orderings';

enum ResultsViewState {
  ByStudent = 1,
  ByItem = 2,
  DistractorAnalysis = 3,
  WritingTraitScores = 4,
  TargetReport = 5
}

@Component({
  selector: 'assessment-results',
  templateUrl: './assessment-results.component.html',
  providers: [ MenuActionBuilder ],
  animations: [
    trigger(
      'fadeAnimation',
      [
        transition(
          ':enter', [
            style({ opacity: 0 }),
            animate('500ms ease-in', style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave', [
            style({ opacity: 1 }),
            animate('500ms ease-out', style({ opacity: 0 }))
          ]
        )
      ]
    )
  ],
})
export class AssessmentResultsComponent implements OnInit {
  /**
   * The assessment exam in which to display results for.
   */
  @Input()
  set assessmentExam(assessment: AssessmentExam) {
    this._assessmentExam = assessment;

    this.sortClaimCodes();

    // if we aren't going to display the sessions, don't waste resources computing them
    if (this.allowFilterBySessions) {
      this.sessions = this.getDistinctExamSessions(assessment.exams);

      if (this.sessions.length > 0) {
        this.toggleSession(this.sessions[ 0 ]);
      }
    }
    this.updateViews();
  }

  /**
   * Service class which provides assessment data for this assessment and exam.
   */
  @Input()
  assessmentProvider: AssessmentProvider;

  /**
   * Service class which provides export capabilities=for this assessment and exam.
   */
  @Input()
  assessmentExporter: AssessmentExporter;

  /**
   * If true, values will be shown as percents.  Otherwise values will be shown
   * as numbers.
   */
  @Input()
  showValuesAsPercent: boolean;

  /**
   * If true, the session toggles will be display with the most recent selected
   * by default.  Otherwise, they won't be displayed and all results will be shown.
   */
  @Input()
  allowFilterBySessions = true;

  /**
   * If true, the target report view will be displayed for Summative assessments. This is a Group only feature,
   * so it will be disabled for the school/grade display.
   */
  @Input()
  allowTargetReport = false;

  /**
   * If true, the results are collapsed by default, otherwise they are expanded
   * with the results shown.
   */
  @Input()
  isDefaultCollapsed = false;

  @Input()
  displayedFor: string;

  /**
   * Represents the cutoff year for when there is no item level response data available.
   * If there are no exams that are after this school year, then disable the ability to go there and show proper message
   */
  @Input()
  set minimumItemDataYear(value: number) {
    this._minimumItemDataYear = value;
    this.updateViews();
  }

  get minimumItemDataYear(): number {
    return this._minimumItemDataYear;
  }

  get filterBy(): FilterBy {
    return this._filterBy;
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
      this.updateExamSessions();

      this._filterBySubscription = this._filterBy.onChanges.subscribe(() => {
        this.updateExamSessions();
      });
    }
  }

  set collapsed(collapsed: boolean) {
    this.assessmentExam.collapsed = collapsed;
  }

  get collapsed(): boolean {
    return this.assessmentExam.collapsed;
  }

  get assessmentExam(): AssessmentExam {
    return this._assessmentExam;
  }

  get displayItemLevelData(): boolean {
    return !this._assessmentExam.assessment.isSummative && this.hasExamsAfterMinimumItemYear;
  }

  get displayWritingTraitScores(): boolean {
    return this._assessmentExam.assessment.hasWerItem;
  }

  get enableWritingTraitScores(): boolean {
    return this.hasExamsAfterMinimumItemYear;
  }

  get displayDistractorAnalysis(): boolean {
    return !this._assessmentExam.assessment.isSummative;
  }

  get displayResultsByItem(): boolean {
    return !this._assessmentExam.assessment.isSummative;
  }

  get displayTargetReport(): boolean {
    return this.allowTargetReport && this._assessmentExam.assessment.isSummative;
  }

  get showStudentResults(): boolean {
    return this.isCurrentView(ResultsViewState.ByStudent);
  }

  get showItemsByPointsEarned(): boolean {
    return this.isCurrentView(ResultsViewState.ByItem);
  }

  get showDistractorAnalysis(): boolean {
    return this.isCurrentView(ResultsViewState.DistractorAnalysis);
  }

  get showWritingTraitScores(): boolean {
    return this.isCurrentView(ResultsViewState.WritingTraitScores);
  }

  get showTargetReport(): boolean {
    return this.isCurrentView(ResultsViewState.TargetReport);
  }

  private isCurrentView(viewState: ResultsViewState): boolean {
    return this.currentResultsView != null && this.currentResultsView.value === viewState;
  }

  get currentExportResults(): ExportResults {
    if (this.showItemsByPointsEarned) {
      return this.resultsByItem;
    }

    if (this.showDistractorAnalysis) {
      return this.distractorAnalysis;
    }

    if (this.showWritingTraitScores) {
      return this.writingTraitScores;
    }

    if (this.showTargetReport) {
      return this.targetReport;
    }

    return undefined;
  }

  private get hasExamsAfterMinimumItemYear(): boolean {
    return this._assessmentExam.exams.some(x => x.schoolYear > this.minimumItemDataYear);
  }

  @ViewChild('menuReportDownloader')
  reportDownloader: StudentReportDownloadComponent;

  @ViewChild('resultsByItem')
  resultsByItem: ResultsByItemComponent;

  @ViewChild('distractorAnalysis')
  distractorAnalysis: DistractorAnalysisComponent;

  @ViewChild('writingTraitScores')
  writingTraitScores: WritingTraitScoresComponent;

  @ViewChild('targetReport')
  targetReport: TargetReportComponent;

  exams: Exam[] = [];
  sessions = [];
  statistics: ExamStatistics;
  currentResultsView: ResultsView;
  resultsByStudentView: ResultsView;
  resultsByItemView: ResultsView;
  distractorAnalysisView: ResultsView;
  writingTraitScoresView: ResultsView;
  targetReportView: ResultsView;
  instructionalResourceProvider: () => Observable<InstructionalResource[]>;
  percentileDisplayEnabled = false;
  showPercentileHistory = false;
  percentileGroups: PercentileGroup[];
  showClaimScores = false;

  private _filterBy: FilterBy;
  private _assessmentExam: AssessmentExam;
  private _filterBySubscription: Subscription;
  private _minimumItemDataYear: number;

  constructor(private applicationSettingsService: ApplicationSettingsService,
              public colorService: ColorService,
              private examCalculator: ExamStatisticsCalculator,
              private examFilterService: ExamFilterService,
              private instructionalResourcesService: InstructionalResourcesService,
              private percentileService: AssessmentPercentileService,
              private angulartics2: Angulartics2) {
  }

  ngOnInit(): void {
    this._assessmentExam.collapsed = this.isDefaultCollapsed;

    this.applicationSettingsService.getSettings().subscribe(settings => {
      this.percentileDisplayEnabled = settings.percentileDisplayEnabled;
    });

    this.setCurrentView(this.resultsByStudentView);
  }

  setShowClaimScores(value: boolean) {
    this.showClaimScores = value;
  }

  updateViews(): void {
    this.resultsByStudentView = this.createResultViewState(ResultsViewState.ByStudent, true, false, true);
    this.resultsByItemView = this.createResultViewState(ResultsViewState.ByItem, this.displayItemLevelData, true, this.displayResultsByItem);
    this.distractorAnalysisView = this.createResultViewState(ResultsViewState.DistractorAnalysis, this.displayItemLevelData, true, this.displayDistractorAnalysis);
    this.writingTraitScoresView = this.createResultViewState(ResultsViewState.WritingTraitScores, this.enableWritingTraitScores, true, this.displayWritingTraitScores);
    this.targetReportView = this.createResultViewState(ResultsViewState.TargetReport, true, true, this.displayTargetReport);
  }

  setCurrentView(view: ResultsView): void {
    this.currentResultsView = view;

    this.angulartics2.eventTrack.next({
      action: 'Assessment View Change',
      properties: {
        category: 'AssessmentResults',
        label: ResultsViewState[ view.value ]
      }
    });
  }

  getGradeIdx(gradeCode: string): number {
    return GradeCode.getIndex(gradeCode);
  }

  toggleSession(session): void {
    session.filter = !session.filter;

    if (this.showTargetReport) {
      this.targetReport.sessions = this.sessions;
    }

    this.updateExamSessions();
  }

  openInstructionalResource(): void {
    window.open(this.assessmentExam.assessment.resourceUrl);
  }

  loadInstructionalResources(assessment: Assessment, performanceLevel: number): void {
    this.instructionalResourceProvider = () => this.instructionalResourcesService
      .getInstructionalResources(assessment.id, this.assessmentProvider.getSchoolId())
      .map((resources) => resources.getResourcesByPerformance(performanceLevel));
  }

  onPercentileButtonClickInternal(): void {
    this.showPercentileHistory = !this.showPercentileHistory;
    if (Utils.isNullOrUndefined(this.percentileGroups)) {
      const results = this.assessmentExam;
      const dates = results.exams.map(exam => new Date(exam.date)).sort();
      const request = <AssessmentPercentileRequest>{
        assessmentId: results.assessment.id,
        from: dates[ 0 ],
        to: dates[ dates.length - 1 ]
      };
      this.percentileService.getPercentilesGroupedByRank(request)
        .subscribe(percentileGroups => this.percentileGroups = percentileGroups);
    }
  }

  private createResultViewState(viewState: ResultsViewState, enabled: boolean, canExport: boolean, display: boolean): ResultsView {
    return {
      label: 'assessment-results.view.' + ResultsViewState[ viewState ],
      value: viewState,
      disabled: !enabled,
      display: display,
      canExport: canExport
    };
  }

  /**
   * Find distinct exam sessions and calculate the most recent date for that session
   * @param {Exam[]} exams
   * @returns {any[]} sessions
   */
  private getDistinctExamSessions(exams: Exam[]): any[] {
    const sessions = [];

    for (const exam of exams) {
      if (!sessions.some(x => x.id === exam.session)) {
        sessions.push({
          id: exam.session,
          date: exams.filter(x => x.session === exam.session)
            .reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b).date,
          filter: false
        });
      }
    }

    return sessions
      .sort(ordering(byString)
        .on<any>(session => session.date)
        .reverse()
        .compare);
  }

  private updateExamSessions(): void {
    this.exams = this.filterExams();
    this.statistics = this.calculateStats();
  }

  private filterExams(): Exam[] {
    const exams: Exam[] = this.examFilterService
      .filterExams(this._assessmentExam.exams, this._assessmentExam.assessment, this._filterBy);

    // only filter by sessions if this is my groups, otherwise return all regardless of session
    if (this.allowFilterBySessions) {
      return exams.filter(x => this.sessions.some(y => y.filter && y.id === x.session));
    }

    return exams;
  }

  private calculateStats(): ExamStatistics {
    const stats = new ExamStatistics();

    let scores = this.examCalculator.getOnlyScoredExams(this.exams).map(x => x.score);

    stats.total = this.exams.length;
    stats.average = this.examCalculator.calculateAverage(scores);
    stats.standardError = this.examCalculator.calculateStandardErrorOfTheMean(scores);

    // TODO: determine a different way for configurable subjects
    stats.levels = this.examCalculator.groupLevels(this.exams, this.assessmentExam.assessment.isIab ? 3 : 4);
    stats.percents = this.examCalculator.mapGroupLevelsToPercents(stats.levels);
    stats.claims = this.examCalculator.calculateClaimStatistics(this.exams, 3);

    return stats;
  }

  sortClaimCodes(): void {
    // sort claim codes
    this._assessmentExam.assessment.claimCodes.sort(createScorableClaimOrdering(this._assessmentExam.assessment.subject).compare);
  }
}

interface ResultsView {
  label: string;
  value: ResultsViewState;
  disabled: boolean;
  canExport: boolean;
  display: boolean;
}

export interface ExportResults {
  exportToCsv(): void;

  hasDataToExport(): boolean;
}
