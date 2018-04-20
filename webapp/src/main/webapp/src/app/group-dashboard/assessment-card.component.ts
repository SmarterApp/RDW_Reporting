import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Group } from '../groups/group';
import { MeasuredAssessment } from './measured-assessment';
import { ColorService } from '../shared/color.service';

@Component({
  selector: 'assessment-card',
  templateUrl: './assessment-card.component.html'
})
export class AssessmentCardComponent implements OnInit {

  @Input()
  group: Group;
  @Input()
  measuredAssessment: MeasuredAssessment;
  @Output()
  selectedAssessment: EventEmitter<AssessmentCardEvent> = new EventEmitter();

  percents: number[] = [];
  dataWidths: number[] = [];
  selected = false;

  constructor(public colorService: ColorService) {
  }

  ngOnInit() {
    this.percents = [
      Math.round(this.measuredAssessment.studentCountByPerformanceLevel[ 0 ].percent),
      Math.round(this.measuredAssessment.studentCountByPerformanceLevel[ 1 ].percent),
      Math.round(this.measuredAssessment.studentCountByPerformanceLevel[ 2 ].percent)
    ];
    // data widths must sum to 100. This avoids issues where the result is 99 or 101
    this.dataWidths = this.percents.concat();
    this.dataWidths[ 1 ] = this.dataWidths[ 0 ] + this.dataWidths[ 1 ] > 100 ? this.dataWidths[ 1 ] - 1 : this.dataWidths[ 1 ];
    this.dataWidths[ 2 ] = 100 - (this.dataWidths[ 0 ] + this.dataWidths[ 1 ]);
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
}

export interface AssessmentCardEvent {
  readonly measuredAssessment: MeasuredAssessment;
  readonly selected: boolean;
}
