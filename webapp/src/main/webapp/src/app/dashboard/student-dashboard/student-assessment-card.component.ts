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
  latestExam: StudentHistoryExamWrapper;
  @Input()
  exams: StudentHistoryExamWrapper[];
  @Output()
  selectedAssessment: EventEmitter<any> = new EventEmitter();

  level: number;
  resultCount: number;
  hasIcon: boolean = true;

  constructor(public colorService: ColorService) {
  }

  ngOnInit() {
    this.level = this.latestExam.exam.level;
    this.resultCount = this.exams.filter(exam =>
      exam.assessment.label === this.latestExam.assessment.label).length;
  }

  getGradeColor(): string {
    return this.colorService.getColor(GradeCode.getIndex(this.latestExam.assessment.grade));
  }

  selectCard(): void {
    this.selectedAssessment.emit(this.latestExam);
  }

}
