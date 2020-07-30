import { ExamTraitScore } from './exam-trait-score.model';
import { ScaleScore } from '../../exam/model/scale-score';
import { School } from '../../shared/organization/organization';
import { Student } from '../../student/model/student.model';

// TODO should contain scaleScore instead of implementing it
export interface Exam extends ScaleScore {
  id: number;
  student: Student;
  date: Date;
  session: string;
  schoolYear: number;
  alternateScaleScores: ScaleScore[];
  claimScaleScores: ScaleScore[];
  accommodationCodes: string[];
  school: School;
  traitScores: ExamTraitScore[];

  // filterable student attributes
  transfer: boolean;
  enrolledGrade: string;
  administrativeCondition: string;
  completeness: string;
  migrantStatus: boolean;
  plan504: boolean;
  economicDisadvantage: boolean;
  iep: boolean;
  limitedEnglishProficiency: boolean;
  elasCode: string;
  languageCode: string;
  militaryConnectedCode: string;
}
