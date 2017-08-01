import { OnInit, Component } from "@angular/core";
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
    this.assessmentItems = routeItems.map(item => this.mapAssessmentItem(item));
    this.exam = this.route.snapshot.data[ "exam" ];
    this.assessment = this.route.snapshot.data[ "assessment" ];
    this.student = this.route.snapshot.data[ "student" ];
  }

  getGradeIndex(grade: string): number {
    return GradeCode.getIndex(grade);
  }

  private mapAssessmentItem(item: AssessmentItem): StudentResponsesAssessmentItem {
    let responseItem = new StudentResponsesAssessmentItem();
    responseItem.assessmentItem = item;

    let score: ExamItemScore = item.scores.length === 1 ?  item.scores[0] : null;
    responseItem.score = score && item.scores[0].points >= 0 ? item.scores[0].points : null;
    let maxScore = item.maxPoints;
    responseItem.correctness = responseItem.score !== null ? responseItem.score / maxScore : null;
    responseItem.response = score ? score.response : null;

    return responseItem;
  }
}
