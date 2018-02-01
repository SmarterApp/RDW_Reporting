import { Student } from "../../../student/model/student.model";
import { School } from "../../../user/model/school.model";
import { WritingTraitScores } from "../../model/writing-trait-scores.model";

export class StudentScore {
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
