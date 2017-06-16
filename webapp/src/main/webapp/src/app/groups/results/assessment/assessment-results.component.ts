import { Component, Input, Output, EventEmitter } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { AssessmentExam } from "../model/assessment-exam.model";
import { Exam } from "../model/exam.model";
import { ExamStatisticsCalculator } from "./exam-statistics-calculator";
import { FilterBy } from "../model/filter-by.model";
import { Subscription } from "rxjs";
import { ExamFilterService } from "../exam-filters/exam-filter.service";
import { GradeService } from "../../../shared/grade.service";

@Component({
  selector: 'assessment-results',
  templateUrl: './assessment-results.component.html',
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
export class AssessmentResultsComponent {
  exams = [];
  sessions = [];
  statistics: any = { percents: {} };

  @Input()
  set assessmentExam(assessment: AssessmentExam) {
    this._assessmentExam = assessment;
    this.sessions = this.getDistinctExamSessions(assessment.exams);

    if (this.sessions.length > 0) {
      this.toggleSession(this.sessions[ 0 ]);
    }
  }

  @Input()
  set showValuesAsPercent(value: boolean) {
    this._showValuesAsPercent = value;
  }

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

  @Output()
  onCollapsed: EventEmitter<boolean> = new EventEmitter();

  get assessmentExam() {
    return this._assessmentExam;
  }

  set collapsed(collapsed: boolean) {
    this.assessmentExam.collapsed = collapsed;
  }

  get collapsed() {
    return this.assessmentExam.collapsed;
  }

  get performance() {
    if (this._showValuesAsPercent)
      return this.statistics.percents;
    else
      return this.statistics;
  }

  get isIab(): boolean {
    return this._assessmentExam.assessment.isIab;
  }

  get examLevelEnum() {
    return this.isIab
      ? "enum.iab-category."
      : "enum.achievement-level.";
  }

  get performanceLevelHeader() {
    return "labels.groups.results.exam-cols." +
      (this.isIab ? "iab" : "ica") + ".performance";
  }

  private _filterBy: FilterBy;
  private _assessmentExam: AssessmentExam;
  private _showValuesAsPercent: boolean;
  private _filterBySubscription: Subscription;

  constructor(public gradeService : GradeService,
              private examCalculator: ExamStatisticsCalculator,
              private examFilterService: ExamFilterService) {
  }

  /**
   * Toggle the collapsed state of this result.
   * Emit an onCollapsed event with the new collapsed state.
   */
  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.onCollapsed.emit(this.collapsed);
  }

  toggleSession(session) {
    session.filter = !session.filter;
    this.updateExamSessions();
  }

  private getDistinctExamSessions(exams: Exam[]) {
    let sessions = [];

    exams.forEach(exam => {
      if (!sessions.some(x => x.id == exam.session)) {
        sessions.push({ id: exam.session, date: exam.date, filter: false });
      }
    });

    return sessions;
  }

  private updateExamSessions() {
    this.exams = this.filterExams();
    this.statistics = this.calculateStats();
  }

  private filterExams() {
    return this.examFilterService
      .filterExams(this._assessmentExam, this._filterBy)
      .filter(x => this.sessions.some(y => y.filter && y.id == x.session));
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
}
