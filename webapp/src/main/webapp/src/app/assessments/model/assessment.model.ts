import { AssessmentType } from "../../shared/enum/assessment-type.enum";

export class Assessment {
  id: number;
  name: string;
  grade: number;
  type: AssessmentType;
  selected: boolean;
  subject: string;
  claimCodes: string[];

  get isIab() {
    return this.type == AssessmentType.IAB;
  }

  get isInterim() {
    return this.type != AssessmentType.SUMMATIVE;
  }

  get isSummative() {
    return this.type == AssessmentType.SUMMATIVE;
  }
}
