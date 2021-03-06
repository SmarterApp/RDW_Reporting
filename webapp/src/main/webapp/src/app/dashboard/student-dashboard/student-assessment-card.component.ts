import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { StudentHistoryExamWrapper } from '../../student/model/student-history-exam-wrapper.model';
import { gradeColor } from '../../shared/colors';

@Component({
  selector: 'student-assessment-card',
  templateUrl: './student-assessment-card.component.html',
  styleUrls: ['./student-assessment-card.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentAssessmentCardComponent {
  @Output()
  selectedAssessment: EventEmitter<any> = new EventEmitter();

  _latestExam: StudentHistoryExamWrapper;
  _exams: StudentHistoryExamWrapper[];
  _color: string;
  _level: number;
  _resultCount: number;

  // TODO remove need for this with styling
  hasIcon: boolean = true;

  @Input()
  set latestExam(value: StudentHistoryExamWrapper) {
    this._latestExam = value;
    this._level = value.exam.level;
    this._color = gradeColor(value.assessment.grade);
    this.initialize();
  }

  @Input()
  set exams(values: StudentHistoryExamWrapper[]) {
    this._exams = values;
    this.initialize();
  }

  private initialize(): void {
    if (this._latestExam != null && this._exams != null) {
      // seems to be an odd behavior where the exams of the card change when selected
      // so here we only compute this once
      if (this._resultCount == null) {
        this._resultCount = this._exams.filter(
          exam => exam.assessment.label === this._latestExam.assessment.label
        ).length;
      }
    }
  }

  onClick(): void {
    this.selectedAssessment.emit(this._latestExam);
  }
}
