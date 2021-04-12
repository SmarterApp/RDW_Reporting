import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AssessmentExam } from '../model/assessment-exam.model';
import { Exam } from '../model/exam';
import { ExamStatisticsCalculator } from './exam-statistics-calculator';
import { FilterBy } from '../model/filter-by.model';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ExamFilterService } from '../filters/exam-filters/exam-filter.service';
import { ordering } from '@kourge/ordering';
import { byString } from '@kourge/ordering/comparator';
import { MenuActionBuilder } from '../menu/menu-action.builder';
import { ExamStatistics } from '../model/exam-statistics.model';
import { AssessmentProvider } from '../assessment-provider.interface';
import { ResultsByItemComponent } from './view/results-by-item/results-by-item.component';
import { DistractorAnalysisComponent } from './view/distractor-analysis/distractor-analysis.component';
import { InstructionalResourcesService } from '../../shared/service/instructional-resources.service';
import { InstructionalResource } from '../../shared/model/instructional-resource';
import { WritingTraitScoresComponent } from './view/writing-trait-scores/writing-trait-scores.component';
import { AssessmentExporter } from '../assessment-exporter.interface';
import {
  AssessmentPercentileRequest,
  AssessmentPercentileService
} from '../percentile/assessment-percentile.service';
import { PercentileGroup } from '../percentile/assessment-percentile';
import { Utils } from '../../shared/support/support';
import { ApplicationSettingsService } from '../../app-settings.service';
import { Angulartics2 } from 'angulartics2';
import { TargetReportComponent } from './view/target-report/target-report.component';
import { SubjectService } from '../../subject/subject.service';
import { SubjectDefinition } from '../../subject/subject';
import { map } from 'rxjs/internal/operators';
import { Option } from '../../shared/form/option';
import { TranslateService } from '@ngx-translate/core';
import {
  average,
  ScoreType,
  standardErrorOfMean
} from '../../exam/model/score-statistics';
import { toScoreTable } from '../../exam/component/score-table/score-tables';
import { ScoreTable } from '../../exam/component/score-table/score-table';
import { ExportResults } from './view/export-results';

enum ResultsViewState {
  ByStudent = 1,
  ByItem = 2,
  DistractorAnalysis = 3,
  WritingTraitScores = 4,
  TargetReport = 5
}

export interface AssessmentExamView extends AssessmentExam {
  collapsed?: boolean;
}

interface ResultsView {
  label: string;
  value: ResultsViewState;
  disabled: boolean;
  canExport: boolean;
  display: boolean;
}

function createScoreTypeOptions(
  subjectDefinition: SubjectDefinition,
  translateService: TranslateService
): Option[] {
  const options = [
    {
      value: 'Overall',
      text: translateService.instant('common.buttons.display-overall'),
      analyticsProperties: {
        label: 'Score Type: Overall'
      }
    }
  ];
  if (subjectDefinition.alternateScore != null) {
    options.push({
      value: 'Alternate',
      text: translateService.instant(
        `subject.${subjectDefinition.subject}.asmt-type.${
          subjectDefinition.assessmentType
        }.alt-score.name`
      ),
      analyticsProperties: {
        label: 'Score Type: Alternate'
      }
    });
  }
  if (subjectDefinition.claimScore != null) {
    options.push({
      value: 'Claim',
      text: translateService.instant(
        `subject.${subjectDefinition.subject}.asmt-type.${
          subjectDefinition.assessmentType
        }.claim-score.name`
      ),
      analyticsProperties: {
        label: 'Score Type: Claim'
      }
    });
  }
  return options;
}

@Component({
  selector: 'assessment-results',
  templateUrl: './assessment-results.component.html',
  styleUrls: ['./assessment-results.component.less'],
  providers: [MenuActionBuilder],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AssessmentResultsComponent implements OnInit {
  /**
   * The assessment exam in which to display results for.
   */
  @Input()
  set assessmentExam(value: AssessmentExamView) {
    this._assessmentExam = value;

    // if we aren't going to display the sessions, don't waste resources computing them
    if (this.allowFilterBySessions) {
      this.sessions = this.getDistinctExamSessions(value.exams);

      if (this.sessions.length > 0) {
        this.toggleSession(this.sessions[0]);
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
   * Derived from assessment grade
   */
  color: string;

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

  get assessmentExam(): AssessmentExamView {
    return this._assessmentExam;
  }

  get displayItemLevelData(): boolean {
    return (
      this._assessmentExam.assessment.type !== 'sum' &&
      this.hasExamsAfterMinimumItemYear
    );
  }

  /**
   * The writing trait scores view should be listed for summative assessments
   * that have trait report enabled (exam-level), and for (non-summative) ELA
   * assessments that have WER items (item-level).
   */
  get displayWritingTraitScores(): boolean {
    if (this._assessmentExam.assessment.type === 'sum') {
      return this._assessmentExam.assessment.traitReportEnabled;
    } else if (this._assessmentExam.assessment.subject === 'ELA') {
      return this._assessmentExam.assessment.hasWerItem;
    } else {
      return false;
    }
  }

  /**
   * The writing trait scores view should be enabled for all exam-level (summative)
   * assessments, and for item-level assessments only if item-level data is being
   * displayed (which is based on the exam having a date after item-level data was
   * introduced).
   *
   * NOTE: the "enable" flag is checked only if the "display" flag is true.
   */
  get enableWritingTraitScores(): boolean {
    return (
      this._assessmentExam.assessment.type === 'sum' ||
      this.displayItemLevelData
    );
  }

  get displayDistractorAnalysis(): boolean {
    return this._assessmentExam.assessment.type !== 'sum';
  }

  get displayResultsByItem(): boolean {
    return this._assessmentExam.assessment.type !== 'sum';
  }

  get displayTargetReport(): boolean {
    return (
      this.allowTargetReport &&
      this._assessmentExam.assessment.targetReportEnabled
    );
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

  get meetsThreshold(): boolean {
    return this._overallScoreTable.resultCount >= this._minimumStudentCount;
  }

  private isCurrentView(viewState: ResultsViewState): boolean {
    return (
      this.currentResultsView != null &&
      this.currentResultsView.value === viewState
    );
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

  get exportButtonDisabled(): boolean {
    return (
      this.currentExportResults == null ||
      !this.currentExportResults.hasDataToExport()
    );
  }

  private get hasExamsAfterMinimumItemYear(): boolean {
    return this._assessmentExam.exams.some(
      x => x.schoolYear > this.minimumItemDataYear
    );
  }

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
  subjectDefinition: SubjectDefinition;
  scoreTypeOptions: Option[] = [];
  showInstructionalResources: boolean;
  uuid: String = Utils.newGuid();

  /**
   * The active score type in the display
   */
  scoreType: ScoreType = 'Overall';

  _overallScoreTable: ScoreTable;
  _alternateScoreTable: ScoreTable;
  _claimScoreTable: ScoreTable;

  private _filterBy: FilterBy;
  private _assessmentExam: AssessmentExamView;
  private _filterBySubscription: Subscription;
  private _minimumItemDataYear: number;
  private _minimumStudentCount: number;

  constructor(
    private applicationSettingsService: ApplicationSettingsService,
    private examCalculator: ExamStatisticsCalculator,
    private examFilterService: ExamFilterService,
    private instructionalResourcesService: InstructionalResourcesService,
    private percentileService: AssessmentPercentileService,
    private subjectService: SubjectService,
    private angulartics2: Angulartics2,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.showInstructionalResources =
      this.assessmentExam.assessment.type === 'iab';

    forkJoin(
      this.applicationSettingsService.getSettings(),
      this.subjectService.getSubjectDefinitionForAssessment(
        this.assessmentExam.assessment
      )
    ).subscribe(([settings, subjectDefinition]) => {
      this.percentileDisplayEnabled = settings.percentileDisplayEnabled;
      this.subjectDefinition = subjectDefinition;
      this._minimumStudentCount = settings.targetReport.minimumStudentCount;

      this.scoreTypeOptions = createScoreTypeOptions(
        subjectDefinition,
        this.translateService
      );

      this.setCurrentView(this.resultsByStudentView);

      this.updateExamSessions();
    });
  }

  updateViews(): void {
    this.resultsByStudentView = this.createResultViewState(
      ResultsViewState.ByStudent,
      true,
      false,
      true
    );
    this.resultsByItemView = this.createResultViewState(
      ResultsViewState.ByItem,
      this.displayItemLevelData,
      true,
      this.displayResultsByItem
    );
    this.distractorAnalysisView = this.createResultViewState(
      ResultsViewState.DistractorAnalysis,
      this.displayItemLevelData,
      true,
      this.displayDistractorAnalysis
    );
    this.writingTraitScoresView = this.createResultViewState(
      ResultsViewState.WritingTraitScores,
      this.enableWritingTraitScores,
      true,
      this.displayWritingTraitScores
    );
    this.targetReportView = this.createResultViewState(
      ResultsViewState.TargetReport,
      this.meetsThreshold,
      true,
      this.displayTargetReport
    );
  }

  setCurrentView(view: ResultsView): void {
    this.currentResultsView = view;

    this.angulartics2.eventTrack.next({
      action: 'Assessment View Change',
      properties: {
        category: 'AssessmentResults',
        label: ResultsViewState[view.value]
      }
    });
  }

  toggleSession(session): void {
    session.filter = !session.filter;
    this.updateExamSessions();
  }

  openInstructionalResource(): void {
    window.open(this.assessmentExam.assessment.resourceUrl);
  }

  onInstructionalResourceLinkClick(performanceLevel: number): void {
    this.instructionalResourceProvider = () =>
      this.instructionalResourcesService
        .getInstructionalResources(
          this.assessmentExam.assessment.id,
          this.assessmentProvider.getSchoolId()
        )
        .pipe(
          map(resources =>
            resources.getResourcesByPerformance(performanceLevel)
          )
        );
  }

  onPercentileButtonClickInternal(): void {
    this.showPercentileHistory = !this.showPercentileHistory;
    if (Utils.isNullOrUndefined(this.percentileGroups)) {
      const results = this.assessmentExam;
      // sort dates ascending
      const dates = results.exams
        .map(exam => exam.date)
        .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
      const request = <AssessmentPercentileRequest>{
        assessmentId: results.assessment.id,
        from: dates[0],
        to: dates[dates.length - 1]
      };
      this.percentileService
        .getPercentilesGroupedByRank(request)
        .subscribe(
          percentileGroups => (this.percentileGroups = percentileGroups)
        );
    }
  }

  private createResultViewState(
    viewState: ResultsViewState,
    enabled: boolean,
    canExport: boolean,
    display: boolean
  ): ResultsView {
    return {
      label: 'assessment-results.view.' + ResultsViewState[viewState],
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
          date: exams
            .filter(x => x.session === exam.session)
            .reduce((a, b) => (new Date(a.date) > new Date(b.date) ? a : b))
            .date,
          filter: false
        });
      }
    }

    return sessions.sort(
      ordering(byString)
        .on<any>(session => session.date)
        .reverse().compare
    );
  }

  private updateExamSessions(): void {
    this.exams = this.filterExams();
    this.statistics =
      this.subjectDefinition != null ? this.calculateStats() : null;

    // compute table when ready
    if (
      this.exams != null &&
      this.subjectDefinition != null &&
      this.assessmentExam != null
    ) {
      this._overallScoreTable = toScoreTable(
        this.exams,
        this.subjectDefinition,
        'Overall'
      );

      if (this.subjectDefinition.alternateScore != null) {
        this._alternateScoreTable = toScoreTable(
          this.exams,
          this.subjectDefinition,
          'Alternate',
          this.assessmentExam.assessment.alternateScoreCodes
        );
      }

      if (this.subjectDefinition.claimScore != null) {
        this._claimScoreTable = toScoreTable(
          this.exams,
          this.subjectDefinition,
          'Claim',
          this.assessmentExam.assessment.claimCodes
        );
      }
    }
  }

  private filterExams(): Exam[] {
    const exams: Exam[] = this.examFilterService.filterExams(
      this._assessmentExam.exams,
      this._assessmentExam.assessment,
      this._filterBy
    );

    // only filter by sessions if this is my groups, otherwise return all regardless of session
    if (this.allowFilterBySessions) {
      return exams.filter(x =>
        this.sessions.some(y => y.filter && y.id === x.session)
      );
    }

    return exams;
  }

  // todo use scoreStatistics
  private calculateStats(): ExamStatistics {
    const stats = new ExamStatistics();

    const scores = this.exams
      .filter(exam => exam && exam.score) // should be score != null but original examCalculator has it this way
      .map(x => x.score);

    const scored = scores.filter(value => value != null);

    stats.total = this.exams.length;
    stats.average = average(scored);
    stats.standardError = standardErrorOfMean(scored);
    stats.levels = this.examCalculator.groupLevels(
      this.exams,
      this.subjectDefinition.overallScore.levelCount
    );
    stats.percents = this.examCalculator.mapGroupLevelsToPercents(stats.levels);

    if (this.subjectDefinition.claimScore != null) {
      stats.claims = this.examCalculator.calculateClaimStatistics(
        this.exams,
        this.subjectDefinition.claimScore.levelCount
      );
    }
    return stats;
  }
}
