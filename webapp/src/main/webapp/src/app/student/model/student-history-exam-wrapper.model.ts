
import { Assessment } from "../../assessments/model/assessment.model";
import { Exam } from "../../assessments/model/exam.model";
import { School } from "../../shared/organization/organization";

/**
 * This model represents an exam from a student's history, with associated
 * Assessment and School information.
 */
export class StudentHistoryExamWrapper {

  public assessment: Assessment;
  public exam: Exam;
  public school: School;
  public selected = false;

}
