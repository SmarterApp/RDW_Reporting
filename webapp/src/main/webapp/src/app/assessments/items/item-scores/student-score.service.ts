import { Injectable } from "@angular/core";
import { AssessmentItem } from "../../model/assessment-item.model";
import { StudentScore } from "./student-score.model";
import { ExamItemScore } from "../../model/exam-item-score.model";
import { Exam } from "../../model/exam.model";

@Injectable()
export class StudentScoreService {
  getScores(item: AssessmentItem, exams: Exam[]): StudentScore[]{
    return item.scores.map(itemScore => this.getScore(
      itemScore,
      exams.find(exam => exam.id == itemScore.examId),
      item.maxPoints
    ));
  }

  private getScore(itemScore: ExamItemScore, exam: Exam, maxPoints: number): StudentScore {
    let score = new StudentScore();

    score.student = exam.student;
    score.date = exam.date;
    score.session = exam.session;
    score.enrolledGrade = exam.enrolledGrade;
    score.school = exam.school;
    score.score = itemScore.points;
    score.maxScore = maxPoints;

    if(score.maxScore) {
      score.correctness = score.score / score.maxScore;
    }

    score.response = itemScore.response;

    return score;
  }
}
