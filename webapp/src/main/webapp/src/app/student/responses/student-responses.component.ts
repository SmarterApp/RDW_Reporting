import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AssessmentItem } from "../../assessments/model/assessment-item.model";
import { Exam } from "../../assessments/model/exam.model";
import { Assessment } from "../../assessments/model/assessment.model";
import { GradeCode } from "../../shared/enum/grade-code.enum";
import { ColorService } from "../../shared/color.service";
import { StudentResponsesAssessmentItem } from "./student-responses-item.model";
import { Student } from "../model/student.model";
import { ExamItemScore } from "../../assessments/model/exam-item-score.model";

/**
 * This component is responsible for displaying a student's responses to a
 * particular assessment for a single exam.
 */
@Component({
  selector: 'student-responses',
  templateUrl: './student-responses.component.html'
})
export class StudentResponsesComponent implements OnInit {

  assessment: Assessment;
  assessmentItems: StudentResponsesAssessmentItem[];
  exam: Exam;
  student: Student;

  constructor(public colorService: ColorService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    let routeItems: AssessmentItem[] = this.route.snapshot.data[ "assessmentItems" ];
    if (routeItems) {
      this.assessmentItems = routeItems.map(item => this.mapAssessmentItem(item));
    }

    this.exam = this.route.snapshot.data[ "exam" ];
    this.assessment = this.route.snapshot.data[ "assessment" ];
    this.student = this.route.snapshot.data[ "student" ];
  }

  getGradeIndex(grade: string): number {
    return GradeCode.getIndex(grade);
  }

  private mapAssessmentItem(item: AssessmentItem): StudentResponsesAssessmentItem {
    const responseItem = new StudentResponsesAssessmentItem();
    responseItem.assessmentItem = item;

    if (item.scores.length !== 1) {
      return responseItem;
    }

    const score: ExamItemScore = item.scores[0];
    if (score.points >= 0) {
      responseItem.score = score.points;
      responseItem.correctness = responseItem.score / item.maxPoints;
    }

    responseItem.response = score.response;
    responseItem.writingTraitScores = score.writingTraitScores;

    return responseItem;
  }
}
