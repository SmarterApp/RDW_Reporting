import { AssessmentType } from "../../shared/enum/assessment-type.enum";

export class Assessment {
  id: number;
  name: string;
  grade: string;
  type: AssessmentType;
  selected: boolean;
  subject: string;
  claimCodes: string[];
  cutPoints: number[];

  get isIab(): boolean {
    return this.type == AssessmentType.IAB;
  }

  get isIca(): boolean {
    return this.type == AssessmentType.ICA;
  }

  get isInterim(): boolean {
    return this.type != AssessmentType.SUMMATIVE;
  }

  get isSummative(): boolean {
    return this.type == AssessmentType.SUMMATIVE;
  }
}
