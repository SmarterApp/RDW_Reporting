import { Component, Input, OnInit } from '@angular/core';
import { Exam } from '../../model/exam';
import { StudentScoreService } from './student-score.service';
import { StudentScore } from './student-score.model';
import { AssessmentItem } from '../../model/assessment-item.model';
import { MenuActionBuilder } from '../../menu/menu-action.builder';

@Component({
  selector: 'item-scores',
  providers: [MenuActionBuilder],
  templateUrl: './item-scores.component.html'
})
export class ItemScoresComponent implements OnInit {
  /**
   * The assessment item to show in this tab.
   */
  @Input()
  item: AssessmentItem;

  @Input()
  subject: string;

  /**
   * The exam results for this item.
   */
  @Input()
  exams: Exam[];

  /**
   * If true, adds a column to show the student's response to the item.
   */
  @Input()
  includeResponse: boolean;

  @Input()
  writingTraits: string[] = [];

  scores: StudentScore[];
  columns: Column[];

  constructor(private service: StudentScoreService) {}

  ngOnInit() {
    this.scores = this.service.getScores(this.item, this.exams);

    const writingTraitsEnabled = this.writingTraits.length > 0;

    this.columns = [
      new Column({ id: 'name', field: 'student.lastName' }),
      new Column({ id: 'date' }),
      new Column({ id: 'session' }),
      new Column({ id: 'grade', field: 'enrolledGrade' }),
      new Column({ id: 'school', field: 'school.name' }),
      new Column({
        id: 'item-score',
        score: 'response',
        field: 'response',
        visible: this.includeResponse
      }),
      new Column({
        id: 'item-score',
        score: 'score',
        field: 'score',
        visible: !writingTraitsEnabled
      }),
      new Column({
        id: 'item-score',
        score: 'max',
        field: 'maxScore',
        visible: !writingTraitsEnabled
      }),
      new Column({
        id: 'item-score',
        score: 'correctness',
        field: 'correctness',
        visible: !writingTraitsEnabled
      }),
      new Column({
        id: 'trait',
        score: 'evidence',
        field: 'writingTraitScores.evidence',
        visible: this.writingTraits.includes('evidence')
      }),
      new Column({
        id: 'trait',
        score: 'organization',
        field: 'writingTraitScores.organization',
        visible: this.writingTraits.includes('organization')
      }),
      new Column({
        id: 'trait',
        score: 'conventions',
        field: 'writingTraitScores.conventions',
        visible: this.writingTraits.includes('conventions')
      }),
      new Column({
        id: 'trait',
        score: 'total',
        field: 'score',
        visible: this.writingTraits.includes('total')
      })
    ];
  }
}

class Column {
  id: string;
  field: string;
  visible: boolean;

  // Item score / Writing trait score properties
  score?: string;

  constructor({ id, field = '', visible = true, score = '' }) {
    this.id = id;
    this.field = field ? field : id;
    this.visible = visible;
    if (score) {
      this.score = score;
    }
  }
}
