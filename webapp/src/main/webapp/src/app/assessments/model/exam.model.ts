import { ClaimScore } from "./claim-score.model";
import { Student } from "../../student/model/student.model";
import { School } from "../../shared/organization/organization";

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
  standardError?: number;
  migrantStatus: boolean;
  plan504: boolean;
  iep: boolean;
  limitedEnglishProficiency: boolean;
  schoolYear: number;
  claimScores: ClaimScore[];
  accommodationCodes: string[];
  school: School;
  transfer: boolean;
  elasCode: string;
  languageCode: string;
}
