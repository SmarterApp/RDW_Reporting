import { Component, OnInit, Input } from "@angular/core";
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

  scores: StudentScore[];

  constructor(private service: StudentScoreService) { }

  ngOnInit() {
    this.scores = this.service.getScores(this.item, this.exams);
  }
}
