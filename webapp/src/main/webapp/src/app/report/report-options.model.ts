import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../shared/enum/assessment-subject-type.enum";

/**
 * Settings for shaping the content of an exam report
 */
export class ReportOptions {

  public assessmentType: AssessmentType;
  public subject: AssessmentSubjectType;
  public schoolYear: number;
  public language: string;
  public grayscale: boolean;

}
