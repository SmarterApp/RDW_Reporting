
import { OnInit, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AssessmentItem } from "../../assessments/model/assessment-item.model";

/**
 * This component is responsible for displaying a student's responses to a
 * particular assessment for a single exam.
 */
@Component({
  selector: 'student-responses',
  templateUrl: './student-responses.component.html'
})
export class StudentResponsesComponent implements OnInit {

  assessmentItems: AssessmentItem[];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.assessmentItems = this.route.snapshot.data[ "assessmentItems" ];
  }

}
