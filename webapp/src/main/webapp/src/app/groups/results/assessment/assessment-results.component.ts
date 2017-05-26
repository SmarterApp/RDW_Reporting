import { Component, OnInit, Input } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { AssessmentExam } from "./model/assessment-exam.model";
import { Exam } from "./model/exam.model";
import { ExamResultLevel } from "../../../shared/enum/exam-result-level.enum";
import { AssessmentType } from "../../../shared/enum/assessment-type.enum";
import { ExamStatisticsCalculator } from "./exam-statistics-calculator";

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

  private _assessmentExam: AssessmentExam;
  private _exams = [];
  private _sessions = [];
  private _statistics: any = { percents: {} };
  private _showValuesAsPercent: boolean;

  constructor(private _calculator : ExamStatisticsCalculator){

  }

  @Input()
  set assessmentExam(assessment: AssessmentExam) {
    this._assessmentExam = assessment;
    this._sessions = this.getDistinctExamSessions(assessment.exams);

    if (this._sessions.length > 0)
      this.toggleSession(this._sessions[ 0 ]);
  }

  @Input()
  set showValuesAsPercent(value: boolean) {
    this._showValuesAsPercent = value;
  }

  get assessmentExam() {
    return this._assessmentExam;
  }

  get exams() {
    return this._exams;
  }

  get sessions() {
    return this._sessions;
  }

  get statistics() {
    return this._statistics;
  }

  get performance() {
    if (this._showValuesAsPercent)
      return this._statistics.percents;
    else
      return this._statistics;
  }

  get isIab() : boolean {
    return this._assessmentExam.assessment.type == AssessmentType.IAB;
  }

  get examLevelEnum() {
    return this.isIab
      ? "enum.iab-category."
      : "enum.achievement-level.";
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
    this._exams = this._assessmentExam.exams.filter(x => this.sessions.some(y => y.filter && y.id == x.session));
    this._statistics = this.calculateStats();
  }

  private calculateStats() {
    let stats: any = {
      total: this._exams.length,
      average: this._calculator.calculateAverage(this._exams),
      levels: this._calculator.groupLevels(this._exams, this.isIab ? 3 : 4)
    };

    stats.percents = { levels: this._calculator.calculateLevelPercents(stats.levels, stats.total) };
    return stats;
  }
}
