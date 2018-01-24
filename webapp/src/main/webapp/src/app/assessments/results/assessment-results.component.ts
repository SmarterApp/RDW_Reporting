import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { animate, style, transition, trigger } from "@angular/animations";
import { AssessmentExam } from "../model/assessment-exam.model";
import { Exam } from "../model/exam.model";
import { ExamStatisticsCalculator } from "./exam-statistics-calculator";
import { FilterBy } from "../model/filter-by.model";
import { Subscription } from "rxjs/Subscription";
import { ExamFilterService } from "../filters/exam-filters/exam-filter.service";
import { ordering } from "@kourge/ordering";
import { byString } from "@kourge/ordering/comparator";
import { GradeCode } from "../../shared/enum/grade-code.enum";
import { ColorService } from "../../shared/color.service";
import { MenuActionBuilder } from "../menu/menu-action.builder";
import { ExamStatistics } from "../model/exam-statistics.model";
import { StudentReportDownloadComponent } from "../../report/student-report-download.component";
import { AssessmentProvider } from "../assessment-provider.interface";
import { ResultsByItemComponent } from "./view/results-by-item/results-by-item.component";
import { DistractorAnalysisComponent } from "./view/distractor-analysis/distractor-analysis.component";
import { InstructionalResourcesService } from "./instructional-resources.service";
import { InstructionalResource } from "../model/instructional-resources.model";
import { Assessment } from "../model/assessment.model";
import { Observable } from "rxjs/Observable";
import {WritingTraitScoresComponent} from "./view/writing-trait-scores/writing-trait-scores.component";

enum ResultsViewState {
  ByStudent = 1,
  ByItem = 2,
  DistractorAnalysis = 3,
  WritingTraitScores = 4
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

    // if we aren't going to display the sessions, don't waste resources computing them
    if (this.allowFilterBySessions) {
      this.sessions = this.getDistinctExamSessions(assessment.exams);

      if (this.sessions.length > 0) {
        this.toggleSession(this.sessions[ 0 ]);
      }
    }
  }

  /**
   * Service class which provides assessment data for this assessment and exam.
   */
  @Input()
  assessmentProvider: AssessmentProvider;

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
  allowFilterBySessions: boolean = true;

  /**
   * Represents the cutoff year for when there is no item level response data available.
   * If there are no exams that are after this school year, then disable the ability to go there and show proper message
   */
  @Input()
  minimumItemDataYear: number;

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

  get collapsed() {
    return this.assessmentExam.collapsed;
  }

  get assessmentExam() {
    return this._assessmentExam;
  }

  get displayItemLevelData(): boolean {
    return !this._assessmentExam.assessment.isSummative && this._assessmentExam.exams.some(x => x.schoolYear > this.minimumItemDataYear);
  }

  get displayWritingTraitScores(): boolean {
    return this._assessmentExam.assessment.subject == 'ELA';
  }

  get enableWritingTraitScores(): boolean {
    return this._assessmentExam.assessment.isIab && this.displayItemLevelData;
  }

  get showStudentResults(): boolean {
    return this.currentResultsView.value == ResultsViewState.ByStudent;
  }

  get showItemsByPointsEarned(): boolean {
    return this.currentResultsView.value == ResultsViewState.ByItem;
  }

  get showDistractorAnalysis(): boolean {
    return this.currentResultsView.value == ResultsViewState.DistractorAnalysis;
  }

  get showWritingTraitScores(): boolean {
    return this.currentResultsView.value == ResultsViewState.WritingTraitScores;
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

    return undefined;
  }

  @ViewChild('menuReportDownloader')
  reportDownloader: StudentReportDownloadComponent;

  @ViewChild('resultsByItem')
  resultsByItem: ResultsByItemComponent;

  @ViewChild('distractorAnalysis')
  distractorAnalysis: DistractorAnalysisComponent;

  @ViewChild('writingTraitScores')
  writingTraitScores: WritingTraitScoresComponent;

  exams: Exam[] = [];
  sessions = [];
  statistics: ExamStatistics;
  currentResultsView: ResultsView;
  resultsByStudentView: ResultsView;
  resultsByItemView: ResultsView;
  distractorAnalysisView: ResultsView;
  writingTraitScoresView: ResultsView;
  instructionalResourceProvider: () => Observable<InstructionalResource[]>;

  private _filterBy: FilterBy;
  private _assessmentExam: AssessmentExam;
  private _filterBySubscription: Subscription;

  constructor(public colorService: ColorService,
              private examCalculator: ExamStatisticsCalculator,
              private examFilterService: ExamFilterService,
              private instructionalResourcesService: InstructionalResourcesService) {
  }

  ngOnInit(): void {
    this.setViews();
    this.setCurrentView(this.resultsByStudentView);
  }

  setViews(): void {
    this.resultsByStudentView = this.getResultViewState(ResultsViewState.ByStudent, true, false, true);
    this.resultsByItemView = this.getResultViewState(ResultsViewState.ByItem, this.displayItemLevelData, true, true)
    this.distractorAnalysisView = this.getResultViewState(ResultsViewState.DistractorAnalysis, this.displayItemLevelData, true, true);
    this.writingTraitScoresView = this.getResultViewState(ResultsViewState.WritingTraitScores, this.enableWritingTraitScores, true, this.displayWritingTraitScores);
  }

  getResultViewState(viewState: ResultsViewState, enabled: boolean, canExport: boolean, display: boolean): ResultsView {
    return {
      label: 'enum.results-view-state.' + ResultsViewState[ viewState ],
      value: viewState,
      disabled: !enabled,
      display: display,
      canExport: canExport
    }
  }

  setCurrentView(view: ResultsView) {
    this.currentResultsView = view;
  }

  getGradeIdx(gradeCode: string): number {
    return GradeCode.getIndex(gradeCode);
  }

  getCurrentViewIntroductionLabel(): string {
    return 'labels.results-view-state-intro.' + ResultsViewState[ this.currentResultsView.value ];
  }

  toggleSession(session) {
    session.filter = !session.filter;
    this.updateExamSessions();
  }

  openInstructionalResource() {
    window.open(this.assessmentExam.assessment.resourceUrl);
  }

  loadInstructionalResources(assessment: Assessment, performanceLevel: number) {
    this.instructionalResourceProvider = () => this.instructionalResourcesService.getInstructionalResources(assessment.id, this.assessmentProvider.getSchoolId())
        .map((resources) => resources.getResourcesByPerformance(performanceLevel));
  }

  private getDistinctExamSessions(exams: Exam[]) {
    let sessions = [];

    for (let exam of exams) {
      if (!sessions.some(x => x.id == exam.session)) {
        sessions.push({ id: exam.session, date: exam.date, filter: false });
      }
    }

    return sessions
      .sort(ordering(byString)
        .on<any>(session => session.date)
        .reverse()
        .compare);
  }

  private updateExamSessions() {
    this.exams = this.filterExams();
    this.statistics = this.calculateStats();
  }

  private filterExams() {
    let exams: Exam[] = this.examFilterService
      .filterExams(this._assessmentExam, this._filterBy);

    // only filter by sessions if this is my groups, otherwise return all regardless of session
    if (this.allowFilterBySessions) {
      return exams.filter(x => this.sessions.some(y => y.filter && y.id == x.session));
    }

    return exams;
  }

  private calculateStats(): ExamStatistics {
    let stats = new ExamStatistics();

    stats.total = this.exams.length;
    stats.average = this.examCalculator.calculateAverage(this.exams);
    stats.standardError = this.examCalculator.calculateStandardErrorOfTheMean(this.exams);
    stats.levels = this.examCalculator.groupLevels(this.exams, this.assessmentExam.assessment.isIab ? 3 : 4);
    stats.percents = this.examCalculator.mapGroupLevelsToPercents(stats.levels);

    return stats;
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
