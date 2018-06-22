import { Component, Input, OnInit } from "@angular/core";
import { Exam } from "../../model/exam.model";
import { StudentScoreService } from "./student-score.service";
import { StudentScore } from "./student-score.model";
import { AssessmentItem } from "../../model/assessment-item.model";
import { MenuActionBuilder } from "../../menu/menu-action.builder";

@Component({
  selector: 'item-scores',
  providers: [ MenuActionBuilder ],
  templateUrl: './item-scores.component.html'})
export class ItemScoresComponent implements OnInit {
  /**
   * The assessment item to show in this tab.
   */
  @Input()
  item: AssessmentItem;

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
  includeWritingTraitScores: boolean = false;

  scores: StudentScore[];
  columns: Column[];

  constructor(private service: StudentScoreService) { }

  ngOnInit() {
    this.scores = this.service.getScores(this.item, this.exams);

    this.columns = [
      new Column({id: 'name', field: 'student.lastName'}),
      new Column({id: 'date'}),
      new Column({id: 'session'}),
      new Column({id: 'grade', field: 'enrolledGrade'}),
      new Column({id: 'school', field: 'school.name'}),
      new Column({id: 'item-score', score: 'response', field: 'response', visible: this.includeResponse}),
      new Column({id: 'item-score', score: 'score', field: 'score', visible: !this.includeWritingTraitScores}),
      new Column({id: 'item-score', score: 'max', field: 'maxScore', visible: !this.includeWritingTraitScores}),
      new Column({id: 'item-score', score: 'correctness', field: 'correctness', visible: !this.includeWritingTraitScores}),
      new Column({id: 'trait', score: 'evidence', field: 'writingTraitScores.evidence', visible: this.includeWritingTraitScores}),
      new Column({id: 'trait', score: 'organization', field: 'writingTraitScores.organization', visible: this.includeWritingTraitScores}),
      new Column({id: 'trait', score: 'conventions', field: 'writingTraitScores.conventions', visible: this.includeWritingTraitScores}),
      new Column({id: 'trait', score: 'total', field: 'score', visible: this.includeWritingTraitScores})
    ];
  }
}

class Column {
  id: string;
  field: string;
  visible: boolean;

  //Item score / Writing trait score properties
  score?: string;

  constructor({
                id,
                field = '',
                visible = true,
                score = ''
              }) {
    this.id = id;
    this.field = field ? field : id;
    this.visible = visible;
    if (score) {
      this.score = score;
    }
  }
}
