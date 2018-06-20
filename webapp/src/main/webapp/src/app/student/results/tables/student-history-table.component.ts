import { Component, Input, OnInit } from '@angular/core';
import { MenuActionBuilder } from '../../../assessments/menu/menu-action.builder';
import { StudentHistoryExamWrapper } from '../../model/student-history-exam-wrapper.model';
import { Student } from '../../model/student.model';
import { PopupMenuAction } from '../../../shared/menu/popup-menu-action.model';
import { Observable } from 'rxjs/Observable';
import { InstructionalResourcesService } from '../../../assessments/results/instructional-resources.service';
import { InstructionalResource } from '../../../assessments/model/instructional-resources.model';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { StudentResultsFilterService } from '../student-results-filter.service';
import { createScorableClaimOrdering } from '../../../shared/ordering/orderings';

@Component({
  selector: 'student-history-table',
  providers: [ MenuActionBuilder ],
  templateUrl: 'student-history-table.component.html'
})
export class StudentHistoryTableComponent implements OnInit {

  private _exams: StudentHistoryExamWrapper[] = [];

  @Input()
  student: Student;

  assessmentType: string;

  studentHistoryCards: StudentHistoryExamWrapper[] = [];

  columns: Column[] = [];
  /**
   * Represents the cutoff year for when there is no item level response data available.
   * If there are no exams that are after this school year, then disable the ability to go there and show proper message
   */
  @Input()
  minimumItemDataYear: number;

  private originalExams: StudentHistoryExamWrapper[] = [];
  viewState: 'overall' | 'claim' = 'overall';
  instructionalResourcesProvider: () => Observable<InstructionalResource[]>;
  selectedCardRowIndex: number;
  itemsPerRow: number = 3;
  rows: StudentHistoryExamWrapper[][] = [];

  constructor(private actionBuilder: MenuActionBuilder,
              private instructionalResourcesService: InstructionalResourcesService,
              private translateService: TranslateService,
              private studentResultsFilterService: StudentResultsFilterService) {
  }

  ngOnInit(): void {
    this.studentResultsFilterService.filterChange.subscribe(() => {
      delete this.selectedCardRowIndex;
    });
    this.columns = [
      new Column({ id: 'date', field: 'exam.date' }),
      new Column({ id: 'assessment', field: 'assessment.label' }),
      new Column({ id: 'school-year', field: 'exam.schoolYear' }),
      new Column({ id: 'school', field: 'exam.school.name' }),
      new Column({ id: 'enrolled-grade', field: 'exam.enrolledGrade' }),
      new Column({ id: 'status', commonHeader: true, field: 'exam.administrativeCondition', overall: true }),
      new Column({ id: 'performance', field: 'exam.level', overall: true }),
      new Column({ id: 'score', commonHeader: true, field: 'exam.score', overall: true }),
      ...this.getClaimColumns()
    ];
  }

  get exams(): StudentHistoryExamWrapper[] {
    return this._exams;
  }

  @Input()
  set exams(exams: StudentHistoryExamWrapper[]) {
    this._exams = exams;
    this.originalExams = Array.from(exams);
    this.studentHistoryCards = this.getLatestStudentHistoryCards();
    this.rows = _.chunk(this.studentHistoryCards, this.itemsPerRow);
  }

  /**
   * Get table row menu actions.
   *
   * @returns {PopupMenuAction[]} The table row menu actions
   */
  get actions(): PopupMenuAction[] {
    if (this.assessmentType === 'sum') {
      const menuAction: PopupMenuAction = new PopupMenuAction();
      menuAction.displayName = () => {
        return this.translateService.instant('common.menus.responses', this.student);
      };
      menuAction.tooltip = () => {
        return this.translateService.instant('common.messages.no-responses-for-summative-exams');
      };
      menuAction.isDisabled = () => {
        return true;
      };
      return [ menuAction ];
    }

    let builder: MenuActionBuilder = this.actionBuilder
      .newActions()
      .withResponses(x => x.exam.id, () => this.student, x => x.exam.schoolYear > this.minimumItemDataYear);
    if (this.assessmentType === 'iab') {
      builder = builder.withShowResources(this.loadAssessmentInstructionalResources.bind(this));
    }
    return builder.build();
  }

  private updateSelectedCardRowIndex(): void {
    const selectedCardIndex = this.studentHistoryCards
      .indexOf(this.studentHistoryCards.find(studentHistoryCard => studentHistoryCard.selected));

    if (selectedCardIndex < 0) {
      delete this.selectedCardRowIndex;
    }
    this.selectedCardRowIndex = Math.floor(selectedCardIndex / this.itemsPerRow);
  }

  onCardSelection(event: StudentHistoryExamWrapper) {
    const prevSelected = event.selected;
    this.assessmentType = event.assessment.type;
    this.studentHistoryCards.forEach(studentHistoryCard => studentHistoryCard.selected = false);
    event.selected = !prevSelected;
    this.viewState = 'overall';

    this._exams = Array.from(this.originalExams);
    this._exams = this.exams.filter(exam =>
      exam.assessment.label === event.assessment.label);

    this.updateSelectedCardRowIndex();

    // build the columns based off the selected assessment since it impacts the claim columns used
    this.columns = [
      new Column({ id: 'date', field: 'exam.date' }),
      new Column({ id: 'assessment', field: 'assessment.label' }),
      new Column({ id: 'school-year', field: 'exam.schoolYear' }),
      new Column({ id: 'school', field: 'exam.school.name' }),
      new Column({ id: 'enrolled-grade', field: 'exam.enrolledGrade' }),
      new Column({ id: 'status', commonHeader: true, field: 'exam.administrativeCondition', overall: true }),
      new Column({ id: 'performance', field: 'exam.level', overall: true }),
      new Column({ id: 'score', commonHeader: true, field: 'exam.score', overall: true }),
      ...this.getClaimColumns()
    ];
  }

  loadInstructionalResources(studentHistoryExam: StudentHistoryExamWrapper): void {
    const exam = studentHistoryExam.exam;
    this.instructionalResourcesProvider = () =>
      this.instructionalResourcesService.getInstructionalResources(
        studentHistoryExam.assessment.id, exam.school.id).pipe(
        map(resources => resources.getResourcesByPerformance(exam.level))
      );
  }

  loadAssessmentInstructionalResources(studentHistoryExam: StudentHistoryExamWrapper): Observable<InstructionalResource[]> {
    const exam = studentHistoryExam.exam;
    return this.instructionalResourcesService.getInstructionalResources(studentHistoryExam.assessment.id, exam.school.id).pipe(
      map(resources => resources.getResourcesByPerformance(0))
    );
  }

  getLatestStudentHistoryCards(): StudentHistoryExamWrapper[] {
    const returnExams = [];
    const assessmentTitles = new Set(this.exams.map(exam => exam.assessment.label));
    assessmentTitles.forEach((title) => {
      // get the most recent exam
      const examsByTitle = this.exams
        .filter(exam => exam.assessment.label === title && exam.exam.date)
        .sort((a, b) => a.exam.date >= b.exam.date ? -1 : 1)[ 0 ];

      returnExams.push(examsByTitle);
    });

    // deselect all cards
    // TODO consider maintaining selected state accross filter application
    returnExams.forEach((exam: StudentHistoryExamWrapper) => exam.selected = false);
    delete this.selectedCardRowIndex;

    return returnExams;
  }

  private hasClaimColumns(): boolean {
    return this.exams !== undefined && this.exams.length && this.exams[ 0 ].assessment.claimCodes !== undefined;
  }

  private getClaimColumns(): Column[] {
    if (!this.hasClaimColumns()) {
      return [];
    }

    return this.exams[ 0 ].assessment.claimCodes
      .sort(createScorableClaimOrdering(this.exams[ 0 ].assessment.subject).compare)
      .map((claim: string, index: number) => {
        return new Column({
          id: 'claim',
          field: `exam.claimScores.${index}.level`,
          claim: claim,
          index: index
        });
      });
  }

}

class Column {
  id: string;
  commonHeader: boolean;
  field: string;
  overall: boolean;
  claim?: string;
  index?: number;

  constructor({
                id,
                field,
                commonHeader = false,
                overall = false,
                claim = '',
                index = -1
              }) {
    this.id = id;
    this.commonHeader = commonHeader;
    this.field = field;
    this.overall = overall;
    if (claim) {
      this.claim = claim;
    }
    if (index >= 0) {
      this.index = index;
    }
  }
}
