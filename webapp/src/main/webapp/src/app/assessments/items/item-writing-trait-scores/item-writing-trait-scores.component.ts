import { Component, Input } from '@angular/core';
import { StudentResponsesAssessmentItem } from '../../model/student-responses-item.model';
import WritingTraitUtils from '../../model/writing-trait-utils';

@Component({
  selector: 'item-writing-trait-scores',
  templateUrl: './item-writing-trait-scores.component.html'
})
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
    if (
      this.responsesAssessmentItem == null ||
      this.responsesAssessmentItem.writingTraitScores == null
    ) {
      return null;
    }
    return this.responsesAssessmentItem.writingTraitScores.evidence;
  }

  /**
   * The max points for the evidence writing trait
   * @returns {number}
   */
  get evidenceMaxPoints(): number {
    return WritingTraitUtils.evidence().maxPoints;
  }

  /**
   * Return the correctness value for the evidence writing trait score
   * @returns {number}
   */
  get evidenceCorrectness(): number {
    return this.evidence == null ? 0 : this.evidence / this.evidenceMaxPoints;
  }

  /**
   * Return the writing trait organization score or <code>null</code>
   * @returns {number}
   */
  get organization(): number {
    if (
      this.responsesAssessmentItem == null ||
      this.responsesAssessmentItem.writingTraitScores == null
    ) {
      return null;
    }

    return this.responsesAssessmentItem.writingTraitScores.organization;
  }

  /**
   * The max points for the organization writing trait
   * @returns {number}
   */
  get organizationMaxPoints(): number {
    return WritingTraitUtils.organization().maxPoints;
  }

  /**
   * Return the correctness value for the organization writing trait score
   * @returns {number}
   */
  get organizationCorrectness(): number {
    return this.organization == null
      ? 0
      : this.organization / this.organizationMaxPoints;
  }

  /**
   * Return the writing trait conventions score or <code>null</code>
   * @returns {number}
   */
  get conventions(): number {
    if (
      this.responsesAssessmentItem == null ||
      this.responsesAssessmentItem.writingTraitScores == null
    ) {
      return null;
    }

    return this.responsesAssessmentItem.writingTraitScores.conventions;
  }

  /**
   * The max points for the convention writing trait
   * @returns {number}
   */
  get conventionsMaxPoints(): number {
    return WritingTraitUtils.conventions().maxPoints;
  }

  /**
   * Return the correctness value for the organization writing trait score
   * @returns {number}
   */
  get conventionsCorrectness(): number {
    return this.conventions == null
      ? 0
      : this.conventions / this.conventionsMaxPoints;
  }

  /**
   * Return the correctness value for the organization writing trait score
   * @returns {number}
   */
  get totalCorrectness(): number {
    return (
      this.responsesAssessmentItem.score /
      this.responsesAssessmentItem.assessmentItem.maxPoints
    );
  }
}
