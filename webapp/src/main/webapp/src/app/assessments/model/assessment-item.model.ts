import { ExamItemScore } from "./exam-item-score.model";

export class AssessmentItem {
  id: number;
  bankItemKey: string;
  position: number;
  claim: string;
  target: string;
  targetId: number;
  depthOfKnowledge: string;
  mathPractice: string;
  allowCalculator: string;
  difficulty: string;
  commonCoreStandardIds: string[];
  maxPoints: number;
  scores: ExamItemScore[] = [];

  get hasCommonCoreStandards(): boolean {
    return this.commonCoreStandardIds && this.commonCoreStandardIds.length > 0
  }

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
    return this.claim + ' / ' + this.target;
  }

  get fullCredit(): number {
    return this.scores.filter(x => x.points == this.maxPoints).length;
  }

  get fullCreditAsPercent(): number {
    return this.scores.length > 0
      ? this.fullCredit / this.scores.length * 100
      : 0;
  }
}
