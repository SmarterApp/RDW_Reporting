import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../shared/enum/assessment-subject-type.enum";
import { ReportOrder } from "./report-order.enum";

/**
 * Settings for shaping the content of an exam report
 */
export class ReportOptions {

  public assessmentType: AssessmentType;
  public subject: AssessmentSubjectType;
  public schoolYear: number;
  public language: string;
  public grayscale: boolean;
  public order: ReportOrder;
  public name: string;

}
