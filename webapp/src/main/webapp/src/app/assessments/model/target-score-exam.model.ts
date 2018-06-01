import { Exam } from './exam.model';

export class TargetScoreExam extends Exam {
  targetId: number;
  standardMetRelativeResidualScore: number;
  studentRelativeResidualScore: number;
}
