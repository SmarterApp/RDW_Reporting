import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StudentHistoryExamWrapper } from '../../student/model/student-history-exam-wrapper.model';
import { ColorService } from '../../shared/color.service';
import { GradeCode } from '../../shared/enum/grade-code.enum';

@Component({
  selector: 'student-assessment-card',
  templateUrl: './student-assessment-card.component.html'
})
export class StudentAssessmentCardComponent implements OnInit {

  @Input()
  assessment: StudentHistoryExamWrapper;
  @Input()
  exams: StudentHistoryExamWrapper[];
  @Output()
  selectedAssessment: EventEmitter<any> = new EventEmitter();
  @Input()
  selected = false;

  level: number;
  resultCount: number;
  viewState: string;

  constructor(public colorService: ColorService) {
  }

  ngOnInit() {
    this.initStudent();
    this.resultCount = this.exams.filter(exam =>
      exam.assessment.label === this.assessment.assessment.label).length;
  }

  getGradeColor(): string {
    return this.colorService.getColor(GradeCode.getIndex(this.assessment.assessment.grade));
  }

  get date(): Date {
    return this.assessment.exam.date;
  }

  private initStudent(): void {
    this.level = this.assessment.exam.level;
  }

  selectCard(): void {
    this.selectedAssessment.emit(this.assessment);
  }

}
