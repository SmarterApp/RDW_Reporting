import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Group } from '../../groups/group';
import { MeasuredAssessment } from '../measured-assessment';
import { ColorService } from '../../shared/color.service';
import { GradeCode } from '../../shared/enum/grade-code.enum';
import { ExamStatisticsCalculator } from '../../assessments/results/exam-statistics-calculator';

@Component({
  selector: 'group-assessment-card',
  templateUrl: './group-assessment-card.component.html'
})
export class GroupAssessmentCardComponent implements OnInit {

  @Input()
  group: Group;
  @Input()
  measuredAssessment: MeasuredAssessment;
  @Output()
  selectedAssessment: EventEmitter<AssessmentCardEvent> = new EventEmitter();

  percents: number[] = [];
  dataWidths: number[] = [];
  selected = false;

  constructor(public colorService: ColorService, private examCalculator: ExamStatisticsCalculator) {
  }

  ngOnInit() {
    this.percents = this.measuredAssessment.studentCountByPerformanceLevel.map(x => Math.round(x.percent));
    this.dataWidths = this.examCalculator.getDataWidths(
      this.measuredAssessment.studentCountByPerformanceLevel.map(x => x.percent)
    );
  }

  get date(): Date {
    return this.measuredAssessment.date;
  }

  get studentCountFill(): number {
    return Math.min(Math.round((this.measuredAssessment.studentsTested / this.group.totalStudents) * 100), 100);
  }

  selectCard(): void {
    this.selected = !this.selected;
    this.selectedAssessment.emit(<AssessmentCardEvent>{
      measuredAssessment: this.measuredAssessment,
      selected: this.selected
    });
  }

  getGradeColor(): string {
    return this.colorService.getColor(GradeCode.getIndex(this.measuredAssessment.assessment.grade));
  }

}

export interface AssessmentCardEvent {
  readonly measuredAssessment: MeasuredAssessment;
  readonly selected: boolean;
}
