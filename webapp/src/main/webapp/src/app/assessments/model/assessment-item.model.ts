import { ExamItemScore } from "./exam-item-score.model";

export interface DepthOfKnowledge {
  readonly level: number;
  readonly referenceUrl: string;
}

export class AssessmentItem {
  id: number;
  bankItemKey: string;
  position: number;
  claim: string;
  targetId: number;
  targetNaturalId: string;
  depthOfKnowledge: DepthOfKnowledge;
  mathPractice: string;
  allowCalculator: string;
  difficulty: string;
  commonCoreStandardIds: string[];
  maxPoints: number;
  numberOfChoices: number;
  scores: ExamItemScore[] = [];
  type: string;
  answerKey: string;
  performanceTaskWritingType: string;

  get difficultySortOrder() {
    switch (this.difficulty) {
      case 'E':
        return 1;
      case 'M':
        return 2;
      case 'D':
        return 3;
    }
    return 0;
  }

  get claimTarget() {
    return this.claim + ' / ' + this.targetNaturalId;
  }

  get fullCredit(): number {
    return this.scores.filter(x => x.points == this.maxPoints).length;
  }

  get fullCreditAsPercent(): number {
    const scoreCount = this.scores.reduce((count, score) =>
      score.points >= 0 ? count + 1 : count,
      0);
    return scoreCount > 0
      ? this.fullCredit / scoreCount * 100
      : 0;
  }
}
