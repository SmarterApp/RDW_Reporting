import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Assessment } from "../../model/assessment.model";
import * as _ from "lodash";
import { ColorService } from "../../../shared/color.service";
import { GradeCode } from "../../../shared/enum/grade-code.enum";

@Component({
  selector: 'select-assessments',
  templateUrl: './select-assessments.component.html'
})
export class SelectAssessmentsComponent {

  assessmentsByGrade: any[] = [];

  @Input()
  set assessments(value: Assessment[]) {
    this._assessments = value;
    this.assessmentsByGrade = this.groupAssessmentsByGrade();
  }

  get assessments(): Assessment[] {
    return this._assessments;
  }

  @Output()
  selectedAssessmentsChanged: EventEmitter<Assessment> = new EventEmitter()

  private _assessments: Assessment[];

  constructor(public colorService: ColorService) {
  }

  getGradeIdx(gradeCode: string): number {
    return GradeCode.getIndex(gradeCode);
  }

  toggleSelectedAssessment(assessment: Assessment) {
    if (assessment.selected) {
      this.deselectAssessment(assessment)
    } else {
      assessment.selected = true;
      this.selectedAssessmentsChanged.emit(assessment);
    }
  }

  private deselectAssessment(assessment: Assessment) {
    let count = 0;
    this._assessments.forEach(asmt => {
        if (asmt.selected) {
          count++;
          if (count > 1) return;
        }
      }
    );
    if (count > 1) {
      assessment.selected = false;
      this.selectedAssessmentsChanged.emit(assessment);
    }
  }

  private groupAssessmentsByGrade() {
    let assessmentsByGrade = [];

    let grades: string[] = _.uniq(this._assessments.map(assessment => assessment.grade))
      .sort((a, b) => a.localeCompare(b));

    for (let grade of grades) {
      let assessments = this._assessments.filter(x => x.grade == grade);

      if (assessments.length > 0) {
        assessmentsByGrade.push({ grade: grade, assessments: assessments });
      }
    }

    return assessmentsByGrade;
  }
}
