import { Student } from "./student.model";
import { StudentHistoryExamWrapper } from "./student-history-exam-wrapper.model";

/**
 * This model represents the entire exam history of a student.
 */
export class StudentExamHistory {
  public student: Student;
  public exams: StudentHistoryExamWrapper[];

}
