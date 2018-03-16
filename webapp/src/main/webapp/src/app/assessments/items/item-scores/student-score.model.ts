import { Student } from "../../../student/model/student.model";
import { School } from "../../../school-grade/school";
import { WritingTraitScores } from "../../model/writing-trait-scores.model";

export class StudentScore {
  examId: number;
  student: Student;
  date: Date;
  session: string;
  enrolledGrade: string;
  school: School;
  score: number;
  maxScore: number;
  correctness: number;
  response: string;
  writingTraitScores: WritingTraitScores;
}
