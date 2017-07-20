import { Component, Input, OnInit } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { AssessmentExam } from "../model/assessment-exam.model";
import { Exam } from "../model/exam.model";
import { ExamStatisticsCalculator } from "./exam-statistics-calculator";
import { FilterBy } from "../model/filter-by.model";
import { Subscription, Observable } from "rxjs";
import { ExamFilterService } from "../filters/exam-filters/exam-filter.service";
import { AssessmentItem } from "../model/assessment-item.model";
import { ordering } from "@kourge/ordering";
import { byString } from "@kourge/ordering/comparator";
import { PopupMenuAction } from "../menu/popup-menu-action.model";
import { Angulartics2 } from 'angulartics2';
import { GradeCode } from "../../shared/enum/grade-code.enum";
import { ColorService } from "../../shared/color.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MenuActionBuilder } from "../menu/menu-action.builder";

enum ScoreViewState {
  OVERALL = 1,
  CLAIM = 2
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
  exams = [];
  sessions = [];
  statistics: any = { percents: {} };
  filteredAssessmentItems: AssessmentItem[];
  pointColumns: number[];
  showItemsByPoints: boolean = false;

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
        this.toggleSession(this.sessions[0]);
      }
    }
  }

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

  @Input()
  displayState: any = {
    showClaim: ScoreViewState.OVERALL
  };

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

  get assessmentExam() {
    return this._assessmentExam;
  }

  /**
   * Provider function which loads the assessment items when viewing
   * items by points earned.
   */
  @Input()
  loadAssessmentItems: (number) => Observable<AssessmentItem[]>;

  actions: PopupMenuAction[];

  set collapsed(collapsed: boolean) {
    this.assessmentExam.collapsed = collapsed;
  }

  get collapsed() {
    return this.assessmentExam.collapsed;
  }

  get performance() {
    if (this.showValuesAsPercent)
      return this.statistics.percents;
    else
      return this.statistics;
  }

  get isIab(): boolean {
    return this._assessmentExam.assessment.isIab;
  }

  get isIca(): boolean {
    return this._assessmentExam.assessment.isIca;
  }

  get showClaimToggle(): boolean {
    return this._assessmentExam.assessment.isIca || this._assessmentExam.assessment.isSummative;
  }

  get claimCodes(): string[] {
    return this._assessmentExam.assessment.claimCodes;
  }

  get isClaimScoreSelected() {
    return this.displayState.table == ScoreViewState.CLAIM;
  }

  public setClaimScoreSelected() {
    this.displayState.table = ScoreViewState.CLAIM;
  }

  public setOverallScoreSelected() {
    this.displayState.table = ScoreViewState.OVERALL;
  }

  get examLevelEnum() {
    return this.isIab
      ? "enum.iab-category."
      : "enum.achievement-level.";
  }

  get performanceLevelHeader() {
    return "labels.groups.results.assessment.exams.cols." +
      (this.isIab ? "iab" : "ica") + ".performance";
  }

  get performanceLevelHeaderInfo() {
    return this.performanceLevelHeader + "-info";
  }

  private _filterBy: FilterBy;
  private _assessmentExam: AssessmentExam;
  private _assessmentItems: AssessmentItem[];
  private _filterBySubscription: Subscription;

  constructor(public colorService: ColorService,
              private route: ActivatedRoute,
              private examCalculator: ExamStatisticsCalculator,
              private examFilterService: ExamFilterService,
              private actionBuilder: MenuActionBuilder,
              private angulartics2: Angulartics2) {

  }

  ngOnInit(): void {
    this.actions = this.createActions();
  }

  getGradeIdx(gradeCode: string): number {
    return GradeCode.getIndex(gradeCode);
  }

  getPointRowStyleClass(index: number){
    return index == 0 ? 'level-down' : '';
  }

  toggleSession(session) {
    session.filter = !session.filter;
    this.updateExamSessions();
  }

  viewItemsByPoints(viewItemsByPoints: boolean) {
    if (viewItemsByPoints && this.loadAssessmentItems) {
      this.loadAssessmentItems(this.assessmentExam.assessment.id).subscribe(assessmentItems => {
        this.pointColumns = this.examCalculator.getPointFields(assessmentItems);

        this._assessmentItems = assessmentItems;
        this.filteredAssessmentItems = this.filterAssessmentItems(assessmentItems);

        this.examCalculator.aggregateItemsByPoints(this.filteredAssessmentItems);
        this.showItemsByPoints = true;


      });
    }
    else{
      this._assessmentItems = undefined;
      this.filteredAssessmentItems = undefined;
      this.showItemsByPoints = false;
    }

    this.angulartics2.eventTrack.next({
      action: (viewItemsByPoints ? 'View' : 'Hide') + 'ItemsByPointsEarned',
      properties: {
        category: 'AssessmentResults'
      }
    });
  }

  private getDistinctExamSessions(exams: Exam[]) {
    let sessions = [];

    for(let exam of exams){
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

    if(this._assessmentItems) {
      this.filteredAssessmentItems = this.filterAssessmentItems(this._assessmentItems);
      this.examCalculator.aggregateItemsByPoints(this.filteredAssessmentItems);
    }
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

  private filterAssessmentItems(assessmentItems: AssessmentItem[]) {
    let filtered = [];

    for(let assessmentItem of assessmentItems) {
      let filteredItem = Object.assign(new AssessmentItem(), assessmentItem);
      filteredItem.scores = assessmentItem.scores.filter(score => this.exams.some(exam => exam.id == score.examId));
      filtered.push(filteredItem);
    }

    return filtered;
  }

  private calculateStats() {
    let stats: any = {
      total: this.exams.length,
      average: this.examCalculator.calculateAverage(this.exams),
      levels: this.examCalculator.groupLevels(this.exams, this.isIab ? 3 : 4)
    };

    stats.percents = { levels: this.examCalculator.calculateLevelPercents(stats.levels, stats.total) };
    return stats;
  }

  private createActions(): PopupMenuAction[] {
    let builder = this.actionBuilder.newActions();

    if (!this._assessmentExam.assessment.isSummative) {
      builder.withResponses(exam => exam.id, exam => exam.student);
    }

    return builder.withStudentHistory(exam => exam.student).build();
  }
}
