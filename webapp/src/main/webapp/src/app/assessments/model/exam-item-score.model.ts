import { WritingTraitScores } from "./writing-trait-scores.model";

export class ExamItemScore {
  examId: number;
  points: number;
  position: number;
  response: string;
  writingTraitScores: WritingTraitScores;
}
