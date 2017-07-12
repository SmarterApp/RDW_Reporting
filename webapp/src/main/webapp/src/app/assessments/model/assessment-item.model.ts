import { ExamItemScore } from "./exam-item-score.model";

export class AssessmentItem {
  id: number;
  bankItemKey: string;
  position: number;
  claim: string;
  target: string;
  difficulty: string;
  commonCoreStandardIds: string[];
  maxPoints: number;
  scores: ExamItemScore[] = [];

  get claimTarget() {
    return this.claim + ' / ' + this.target;
  }

  get fullCredit() {
    return this.scores.filter(x => x.points == this.maxPoints).length;
  }

  get fullCreditAsPercent(){
    return this.scores.length > 0
      ? this.fullCredit / this.scores.length * 100
      : 0;
  }
}
