import { Student } from "../../../student/model/student.model";

export class StudentScore {
  student: Student;
  date: Date;
  session: string;
  enrolledGrade: string;
  score: number;
  maxScore: number;
  correctness: number;
}
