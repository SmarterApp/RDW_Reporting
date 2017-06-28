import { Component, Input } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { AssessmentExam } from "../model/assessment-exam.model";
import { Exam } from "../model/exam.model";
import { ExamStatisticsCalculator } from "./exam-statistics-calculator";
import { FilterBy } from "../model/filter-by.model";
import { Subscription, Observable } from "rxjs";
import { ExamFilterService } from "../filters/exam-filters/exam-filter.service";
import { GradeService } from "../../shared/grade.service";
import { AssessmentItem } from "../model/assessment-item.model";

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
  filteredAssessmentItems: AssessmentItem[];
  pointColumns: number[];
  showItemsByPoints: boolean = false;

  /**
   * The assessment exam in which to display results for.
   */
  @Input()
  set assessmentExam(assessment: AssessmentExam) {
    this._assessmentExam = assessment;
    this.sessions = this.getDistinctExamSessions(assessment.exams);

    if (this.sessions.length > 0) {
      this.toggleSession(this.sessions[ 0 ]);
    }
  }

  /**
   * If true, values will be shown as percents.  Otherwise values will be shown
   * as numbers.
   */
  @Input()
  showValuesAsPercent: boolean;

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

  constructor(public gradeService: GradeService,
              private examCalculator: ExamStatisticsCalculator,
              private examFilterService: ExamFilterService) {
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

    if(this._assessmentItems) {
      this.filteredAssessmentItems = this.filterAssessmentItems(this._assessmentItems);
      this.examCalculator.aggregateItemsByPoints(this.filteredAssessmentItems);
    }
  }

  private filterExams() {
    return this.examFilterService
      .filterExams(this._assessmentExam, this._filterBy)
      .filter(x => this.sessions.some(y => y.filter && y.id == x.session));
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
}
