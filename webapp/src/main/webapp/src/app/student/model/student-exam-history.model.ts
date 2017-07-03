import { Student } from "./student.model";
import { StudentHistoryExamWrapper } from "./student-history-exam-wrapper.model";

/**
 * This model represents the entire exam history of a student.
 */
export class StudentExamHistory {

  public get student(): Student {
    return this._student;
  }

  public get exams(): StudentHistoryExamWrapper[] {
    return this._exams;
  }

  constructor(
    private _student: Student,
    private _exams: StudentHistoryExamWrapper[]) {}
}
