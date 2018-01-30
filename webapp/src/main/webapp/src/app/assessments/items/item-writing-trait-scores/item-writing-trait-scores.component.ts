import { Component, Input } from "@angular/core";
import { StudentResponsesAssessmentItem } from "../../../student/responses/student-responses-item.model";
import { WritingTrait } from "../../model/writing-trait.model";

@Component({
  selector: 'item-writing-trait-scores',
  templateUrl: './item-writing-trait-scores.component.html'})
export class ItemWritingTraitScoresComponent {

  /**
   * The student responses assessment item results for this item.
   */
  @Input()
  responsesAssessmentItem: StudentResponsesAssessmentItem;

  /**
   * Return the writing trait evidence score or <code>null</code>
   * @returns {number}
   */
  get evidence(): number {
    if (this.responsesAssessmentItem == null || this.responsesAssessmentItem.writingTraitScores == null) return null;

    return this.responsesAssessmentItem.writingTraitScores.evidence;
  }

  /**
   * The max points for the evidence writing trait
   * @returns {number}
   */
  get evidenceMaxPoints(): number {
    return WritingTrait.evidence().maxPoints;
  }

  /**
   * Return the writing trait organization score or <code>null</code>
   * @returns {number}
   */
  get organization(): number {
    if (this.responsesAssessmentItem == null || this.responsesAssessmentItem.writingTraitScores == null) return null;

    return this.responsesAssessmentItem.writingTraitScores.organization;
  }

  /**
   * The max points for the organization writing trait
   * @returns {number}
   */
  get organizationMaxPoints(): number {
    return WritingTrait.organization().maxPoints;
  }

  /**
   * Return the writing trait conventions score or <code>null</code>
   * @returns {number}
   */
  get conventions(): number {
    if (this.responsesAssessmentItem == null || this.responsesAssessmentItem.writingTraitScores == null) return null;

    return this.responsesAssessmentItem.writingTraitScores.conventions;
  }

  /**
   * The max points for the convention writing trait
   * @returns {number}
   */
  get conventionsMaxPoints(): number {
    return WritingTrait.conventions().maxPoints;
  }
}
