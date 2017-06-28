import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Assessment } from "../../model/assessment.model";
import { GradeService } from "../../../shared/grade.service";
import { Grade } from "../../../shared/model/grade.model";

@Component({
  selector: 'select-assessments',
  templateUrl: './select-assessments.component.html'
})
export class SelectAssessmentsComponent implements OnInit {

  grades: Grade[] = [];
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

  constructor(private gradeService: GradeService) {
  }

  ngOnInit() {
    this.grades = this.gradeService.getGrades();
  }

  toggleSelectedAssessment(assessment: Assessment){
    assessment.selected = !assessment.selected;
    this.selectedAssessmentsChanged.emit(assessment);
  }

  private groupAssessmentsByGrade() {
    let assessmentsByGrade = [];

    for (let grade of this.grades) {
      let assessments = grade.id == 9
        ? this._assessments.filter(x => x.grade >= grade.id)
        : this._assessments.filter(x => x.grade == grade.id);

      if (assessments.length > 0) {
        assessmentsByGrade.push({ grade: grade, assessments: assessments });
      }
    }

    return assessmentsByGrade;
  }
}
