import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Group } from '../../groups/group';
import { MeasuredAssessment } from '../measured-assessment';
import { ColorService } from '../../shared/color.service';
import { GradeCode } from '../../shared/enum/grade-code.enum';

@Component({
  selector: 'group-assessment-card',
  templateUrl: './group-assessment-card.component.html'
})
export class GroupAssessmentCardComponent implements OnInit {

  @Input()
  group: Group;
  @Input()
  assessment: MeasuredAssessment;
  @Output()
  selectedAssessment: EventEmitter<AssessmentCardEvent> = new EventEmitter();

  percents: number[] = [];
  dataWidths: number[] = [];
  selected = false;

  constructor(public colorService: ColorService) {
  }

  ngOnInit() {
    this.initGroup();
  }

  get date(): Date {
    return this.assessment.date;
  }

  get studentCountFill(): number {
    return Math.min(Math.round((this.assessment.studentsTested / this.group.totalStudents) * 100), 100);
  }

  selectCard(): void {
    this.selected = !this.selected;
    this.selectedAssessment.emit(<AssessmentCardEvent>{
      measuredAssessment: this.assessment,
      selected: this.selected
    });
  }

  getGradeColor(): string {
    return this.colorService.getColor(GradeCode.getIndex(this.assessment.assessment.grade));
  }


  private initGroup(): void {
    this.percents = [
      Math.round(this.assessment.studentCountByPerformanceLevel[ 0 ].percent),
      Math.round(this.assessment.studentCountByPerformanceLevel[ 1 ].percent),
      Math.round(this.assessment.studentCountByPerformanceLevel[ 2 ].percent)
    ];
    // data widths must sum to 100. This avoids issues where the result is 99 or 101
    this.dataWidths = this.percents.concat();
    this.dataWidths[ 1 ] = this.dataWidths[ 0 ] + this.dataWidths[ 1 ] > 100 ? this.dataWidths[ 1 ] - 1 : this.dataWidths[ 1 ];
    this.dataWidths[ 2 ] = 100 - (this.dataWidths[ 0 ] + this.dataWidths[ 1 ]);
  }
}

export interface AssessmentCardEvent {
  readonly measuredAssessment: MeasuredAssessment;
  readonly selected: boolean;
}
