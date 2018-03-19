import { Student } from "../../../student/model/student.model";
import { WritingTraitScores } from "../../model/writing-trait-scores.model";
import { School } from "../../../shared/organization/organization";

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
