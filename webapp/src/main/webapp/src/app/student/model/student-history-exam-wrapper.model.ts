
import { Assessment } from "../../assessments/model/assessment.model";
import { School } from "../../user/model/school.model";
import { Exam } from "../../assessments/model/exam.model";

/**
 * This model represents an exam from a student's history, with associated
 * Assessment and School information.
 */
export class StudentHistoryExamWrapper {

  public assessment: Assessment;
  public exam: Exam;
  public school: School;

}
