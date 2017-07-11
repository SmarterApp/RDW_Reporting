import { ClaimScore } from "./claim-score.model";
import { Student } from "../../student/model/student.model";

export class Exam {
  id: number;
  student: Student;
  date: Date;
  session: string;
  enrolledGrade: string;
  score: number;
  level: number;
  administrativeCondition: string;
  completeness: string;
  standardError: number;
  migrantStatus: boolean;
  plan504: boolean;
  iep: boolean;
  economicDisadvantage: boolean;
  limitedEnglishProficiency: boolean;
  schoolYear: number;
  claimScores: ClaimScore[];
}
