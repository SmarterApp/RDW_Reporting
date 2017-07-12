
import { OnInit, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AssessmentItem } from "../../assessments/model/assessment-item.model";
import { Exam } from "../../assessments/model/exam.model";
import { Assessment } from "../../assessments/model/assessment.model";
import { GradeCode } from "../../shared/enum/grade-code.enum";
import { ColorService } from "../../shared/color.service";
import { StudentResponsesAssessmentItem } from "./student-responses-item.model";

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

  constructor(public colorService: ColorService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    let routeItems: AssessmentItem[] = this.route.snapshot.data[ "assessmentItems" ];
    this.assessmentItems = routeItems.map(item => this.mapAssessmentItem(item));
    this.exam = this.route.snapshot.data[ "exam" ];
    this.assessment = this.route.snapshot.data[ "assessment" ];
  }

  getGradeIdx(grade: string): number {
    return GradeCode.getIndex(grade);
  }

  private mapAssessmentItem(item: AssessmentItem): StudentResponsesAssessmentItem {
    let responseItem = new StudentResponsesAssessmentItem();
    responseItem.assessmentItem = item;

    let studentScore = item.scores[0].points;
    let maxScore = item.maxPoints;
    responseItem.correctness = studentScore / maxScore;

    return responseItem;
  }
}
