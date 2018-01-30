import { Component, Input } from "@angular/core";
import {StudentResponsesAssessmentItem} from "../../../student/responses/student-responses-item.model";

@Component({
  selector: 'item-writing-trait-scores',
  templateUrl: './item-writing-trait-scores.component.html'})
export class ItemWritingTraitScoresComponent {

  /**
   * The student responses assessment item results for this item.
   */
  @Input()
  responsesAssessmentItem: StudentResponsesAssessmentItem[];
}
